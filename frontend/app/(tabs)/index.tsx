
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Dosimeter from "../../components/Dosimeter/Dosimeter";
import Generator from "../../components/Generator/Generator";
import HealthMonitor from "../../components/HealthMonitor/HealthMonitor";
import OxygenScrubber from "../../components/OxygenScrubber/OxygenScrubber";
import Thermometer from "../../components/Thermometer/Thermometer";
import WaterSensor from "../../components/WaterSensor/WaterSensor";

// Adjust this to match your API port
const API_URL = "http://localhost:5244/api/device";
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 768;

// Mirror the backend DeviceType enum
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

  // Helper to get device value by enum
  const getValue = (type: DeviceType) => {
    const device = devices.find(d => d.type === type);
    return device?.currentValue ?? 0;
  };

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

  return (
    <View style={styles.viewport}>
      <View style={[styles.scaleWrapper, { transform: [{ scale }] }]}>
        <View style={styles.container}>
          {/* Centered health bar at top */}
          <View style={styles.healthContainer}>
            <HealthMonitor value={getValue(DeviceType.HealthMonitor)} />
          </View>

          {/* Centered power & atmosphere controls */}
          <View style={styles.resourceRow}>
            <View style={styles.resourceModule}>
              <WaterSensor value={getValue(DeviceType.WaterSensor)} />
            </View>
            <View style={styles.resourceModule}>
              <Generator value={getValue(DeviceType.Generator)} />
            </View>
            <View style={styles.resourceModule}>
              <OxygenScrubber value={getValue(DeviceType.O2Scrubber)} />
            </View>
          </View>

          {/* Right-side "Exterior Values" box */}
          <View style={styles.exteriorBox}>
            <Text style={styles.exteriorTitle}>Exterior Values</Text>
            <View style={styles.exteriorItem}>
              <Thermometer value={getValue(DeviceType.Thermometer)} />
            </View>
            <View style={styles.exteriorItem}>
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
    gap: 40,
    marginTop: 120,
    alignSelf: "flex-end",
    marginRight: 250,
  },
  resourceModule: {
    alignItems: "center",
  },
  exteriorBox: {
    position: "absolute",
    right: 16,
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
