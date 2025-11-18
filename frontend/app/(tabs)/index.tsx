import LightSwitch from "@/components/LightSwitch/LightSwitch";
import NextDay from "@/components/NextDay/NextDay";
import RationLevel, {
  RationLevelValue,
} from "@/components/RationLevel/RationLevel";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Dosimeter from "../../components/Dosimeter/Dosimeter";
import FoodMonitor from "../../components/FoodMonitor/FoodMonitor";
import { useFoodMonitor } from "../../components/FoodMonitor/useFoodMonitor";
import Generator from "../../components/Generator/Generator";
import HealthMonitor from "../../components/HealthMonitor/HealthMonitor";
import OxygenScrubber from "../../components/OxygenScrubber/OxygenScrubber";
import OxygenScrubberThreshold from "../../components/OxygenScrubber/OxygenScrubberThreshold";
import ScavengeToggle from "../../components/Scavenge/Scavenge"; // adjust path if needed
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
  GeneratorType = 3, // renamed to avoid conflict with component name
  O2Scrubber = 4,
  HealthMonitorType = 5,
  DosimeterType = 6,
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

  const [powerPercent, setPowerPercent] = useState(50);
  const [rationLevel, setRationLevel] =
    useState<RationLevelValue>("medium");
  const [o2Threshold, setO2Threshold] = useState(80);
  const [scavengeAtNight, setScavengeAtNight] = useState(false);

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

    fetchDevices();
    const interval = setInterval(fetchDevices, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyGeneratorPower = async () => {
    try {
      await fetch(`${API_URL}/generator-power`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percentage: powerPercent }),
      });
    } catch (err) {
      console.error("Error updating generator power:", err);
    }
  };

  const handleApplyOxygenScrubberThreshold = async () => {
    console.log("Apply O₂ scrubber threshold:", o2Threshold);
    // await fetch(`${API_URL}/o2scrubber-threshold`, { ... });
  };

  const handleNextDay = async () => {
    console.log("Next Day triggered", {
      powerPercent,
      rationLevel,
      o2Threshold,
      scavengeAtNight,
    });
    // await fetch(`${API_URL}/next-day`, { ... });
  };

  return (
    <View style={styles.viewport}>
      <View style={[styles.scaleWrapper, { transform: [{ scale }] }]}>
        <View style={styles.container}>
          {/* FULL-WIDTH HEALTH BAR ACROSS CANVAS */}
          <View style={styles.healthContainer} data-testid="health-value">
            <HealthMonitor value={getValue(DeviceType.HealthMonitorType)} />
          </View>

          {/* TOP / MIDDLE: resource modules + exterior box */}
          <View style={styles.mainRow}>
            {/* LEFT COLUMN */}
            <View style={styles.leftColumn}>
              <View style={styles.resourceRow}>
                {/* LEFT: Food + Water */}
                <View style={styles.resourceModule} data-testid="food-value">
                  <FoodMonitor value={foodValue} />
                </View>

                <View style={styles.resourceModule} data-testid="water-value">
                  <WaterSensor value={getValue(DeviceType.WaterSensor)} />
                </View>

                {/* CENTER: Light / Generator power control */}
                <View style={styles.resourceModule}>
                  <LightSwitch
                    value={powerPercent}
                    onChange={setPowerPercent}
                    onApply={handleApplyGeneratorPower}
                  />
                </View>

                {/* RIGHT: Generator + O₂ Scrubber + Threshold */}
                <View
                  style={styles.resourceModule}
                  data-testid="generator-value"
                >
                  <Generator value={getValue(DeviceType.GeneratorType)} />
                </View>

                <View
                  style={styles.resourceModule}
                  data-testid="o2scrubber-value"
                >
                  <OxygenScrubber value={getValue(DeviceType.O2Scrubber)} />
                  <OxygenScrubberThreshold
                    value={o2Threshold}
                    onChange={setO2Threshold}
                    onApply={handleApplyOxygenScrubberThreshold}
                  />
                </View>
              </View>
            </View>

            {/* RIGHT COLUMN: Exterior values */}
            <View style={styles.exteriorBox}>
              <Text style={styles.exteriorTitle}>Exterior Values</Text>
              <View style={styles.exteriorItem} data-testid="thermometer-value">
                <Thermometer value={getValue(DeviceType.Thermometer)} />
              </View>
              <View style={styles.exteriorItem} data-testid="dosimeter-value">
                <Dosimeter value={getValue(DeviceType.DosimeterType)} />
              </View>
            </View>
          </View>

          {/* BOTTOM BAR — Ration Level (left) + Scavenge / Next Day (right) */}
          <View style={styles.bottomRow}>
            <RationLevel value={rationLevel} onChange={setRationLevel} />

            <View style={styles.bottomRightColumn}>
              <ScavengeToggle
                value={scavengeAtNight}
                onChange={setScavengeAtNight}
              />
              <NextDay onPress={handleNextDay} />
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
    marginLeft: 80,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#212121ff",
    justifyContent: "space-between",
  },

  healthContainer: {
    width: "100%",
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },

  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },

  leftColumn: {
    flex: 1,
  },

  resourceRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    marginTop: 5,
  },
  resourceModule: {
    alignItems: "center",
  },

  exteriorBox: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginLeft: 100,
    marginTop: 20,
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

  bottomRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 16,
  },
  bottomRightColumn: {
    alignItems: "flex-end",
    gap: 8,
  },
});