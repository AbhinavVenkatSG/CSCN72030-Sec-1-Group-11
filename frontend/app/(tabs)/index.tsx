import LightSwitch from "@/components/LightSwitch/LightSwitch";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Dosimeter from "../../components/Dosimeter/Dosimeter";
import FoodMonitor from "../../components/FoodMonitor/FoodMonitor";
import { useFoodMonitor } from "../../components/FoodMonitor/useFoodMonitor";
import Generator from "../../components/Generator/Generator";
import HealthMonitor from "../../components/HealthMonitor/HealthMonitor";
import OxygenScrubber from "../../components/OxygenScrubber/OxygenScrubber";
import Thermometer from "../../components/Thermometer/Thermometer";
import WaterSensor from "../../components/WaterSensor/WaterSensor";

// API config
const API_URL = "http://localhost:5244/api/device";
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 768;

// Mirror backend DeviceType enum
enum DeviceType {
  Thermometer = 0,
  WaterSensor = 1,
  FoodSensor = 2,
  Generator = 3,
  O2Scrubber = 4,
  HealthMonitor = 5,
  Dosimeter = 6,
}

interface Device {
  type: number;
  currentValue: number;
}

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  // state for the LightSwitch percentage
  const [powerPercent, setPowerPercent] = useState(50);

  // Helper to get device value by enum
  const getValue = (type: DeviceType) => {
    const device = devices.find((d) => d.type === type);
    return device?.currentValue ?? 0;
  };

  const foodValue = useFoodMonitor(getValue(DeviceType.FoodSensor));

  useEffect(() => {
    let isFetching = false;

    const fetchDevices = async () => {
      if (isFetching) return;
      isFetching = true;

      try {
        const res = await fetch(API_URL);
        const data: Device[] = await res.json();
        setDevices(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching device data:", err);
      } finally {
        isFetching = false;
      }
    };

    fetchDevices(); // initial fetch
    const interval = setInterval(fetchDevices, 3000); // poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // called when user taps the LightSwitch box
  const handleApplyGeneratorPower = async () => {
    try {
      await fetch(`${API_URL}/generator-power`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          percentage: powerPercent,
        }),
      });
    } catch (err) {
      console.error("Error updating generator power:", err);
    }
  };

  return (
    <View style={styles.viewport}>
      <View style={[styles.scaleWrapper, { transform: [{ scale }] }]}>
        <View style={styles.container}>
          {/* Health Monitor at top */}
          <View style={styles.healthContainer} data-testid="health-value">
            <HealthMonitor value={getValue(DeviceType.HealthMonitor)} />
          </View>

          {/* Resource row */}
          <View style={styles.resourceRow}>
            <View style={styles.resourceModule} data-testid="water-value">
              <WaterSensor value={getValue(DeviceType.WaterSensor)} />
            </View>

            <View style={styles.resourceModule} data-testid="generator-value">
              <Generator value={getValue(DeviceType.Generator)} />
            </View>

            <View style={styles.resourceModule}>
              <LightSwitch
                value={powerPercent}
                onChange={setPowerPercent}
                onApply={handleApplyGeneratorPower}
              />
            </View>

            <View style={styles.resourceModule} data-testid="o2scrubber-value">
              <OxygenScrubber value={getValue(DeviceType.O2Scrubber)} />
            </View>

            <View style={styles.resourceModule} data-testid="food-value">
              <FoodMonitor value={foodValue} />
            </View>
          </View>

          {/* Exterior values */}
          <View style={styles.exteriorBox}>
            <Text style={styles.exteriorTitle}>Exterior Values</Text>
            <View style={styles.exteriorItem} data-testid="thermometer-value">
              <Thermometer value={getValue(DeviceType.Thermometer)} />
            </View>
            <View style={styles.exteriorItem} data-testid="dosimeter-value">
              <Dosimeter value={getValue(DeviceType.Dosimeter)} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    backgroundColor: "#212121ff",
    alignItems: "center",
    justifyContent: "center",
  },
  scaleWrapper: {
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    alignItems: "stretch",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#212121ff",
  },
  healthContainer: {
    marginTop: 12,
    alignSelf: "stretch",
    alignItems: "center",
    gap: 6,
  },
  resourceRow: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    gap: 50, 
    marginTop: 120, 
    alignSelf: "center", 
  },

  resourceModule: {
    alignItems: "center",
  },
  exteriorBox: {
    position: "absolute",
    right: -125,
    top: "25%",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  exteriorTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
  },
  exteriorItem: {
    alignItems: "center",
    marginVertical: 8,
  },
});
