import LightSwitch from "@/components/LightSwitch/LightSwitch";
import NextDay from "@/components/NextDay/NextDay";
import RationLevel, {
  RationLevelValue,
} from "@/components/RationLevel/RationLevel";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import CoolDown from "../../components/CoolDown/CoolDown";
import Dosimeter from "../../components/Dosimeter/Dosimeter";
import FoodMonitor from "../../components/FoodMonitor/FoodMonitor";
import { useFoodMonitor } from "../../components/FoodMonitor/useFoodMonitor";
import Generator from "../../components/Generator/Generator";
import HealthMonitor from "../../components/HealthMonitor/HealthMonitor";
import OxygenScrubber from "../../components/OxygenScrubber/OxygenScrubber";
import OxygenScrubberThreshold from "../../components/OxygenScrubber/OxygenScrubberThreshold";
import ScavengeToggle from "../../components/Scavenge/Scavenge";
import Thermometer from "../../components/Thermometer/Thermometer";
import WaterSensor from "../../components/WaterSensor/WaterSensor";

import {
  DeviceStatus,
  SetNextDay,
  type NextDayPayload,
} from "./../../BunkerActions/BunkerActions";

const BASE_WIDTH = 1024;
const BASE_HEIGHT = 768;

const INITIAL_NEXT_DAY_SETTINGS: NextDayPayload = {
  powerPercent: 50,
  rationLevel: "medium",
  o2Threshold: 80,
  scavengeAtNight: false,
  coolDownAtNight: false,
};

enum DeviceType {
  Thermometer = 0,
  WaterSensor = 1,
  FoodSensor = 2,
  GeneratorType = 3,
  O2Scrubber = 4,
  HealthMonitorType = 5,
  DosimeterType = 6,
}

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);

  const [devices, setDevices] = useState<DeviceStatus[]>([]);

  const [powerPercent, setPowerPercent] = useState(
    INITIAL_NEXT_DAY_SETTINGS.powerPercent
  );
  const [rationLevel, setRationLevelState] = useState<RationLevelValue>(
    INITIAL_NEXT_DAY_SETTINGS.rationLevel
  );
  const [o2Threshold, setO2ThresholdState] = useState(
    INITIAL_NEXT_DAY_SETTINGS.o2Threshold
  );
  const [scavengeAtNight, setScavengeAtNightState] = useState(
    INITIAL_NEXT_DAY_SETTINGS.scavengeAtNight
  );
  const [coolDownAtNight, setCoolDownAtNight] = useState(
    INITIAL_NEXT_DAY_SETTINGS.coolDownAtNight
  );

  const getValue = (type: DeviceType) => {
    const device = devices.find((d) => d.type === type);
    return device?.currentValue ?? 50; // default 50 if missing
  };

  const foodValue = useFoodMonitor(getValue(DeviceType.FoodSensor));
  const thermometerValue = getValue(DeviceType.Thermometer);
  const generatorValue = getValue(DeviceType.GeneratorType);

  // Lights flip based on whether gas meets/exceeds the threshold.
  const lightsOn = generatorValue >= powerPercent;

  // Two-state background tied to lights on/off.
  const backgroundColor = lightsOn ? "#3a3a6a" : "#050509";

  useEffect(() => {
    const loadInitialDevices = async () => {
      try {
        const initialDevices = await SetNextDay(INITIAL_NEXT_DAY_SETTINGS);
        setDevices(initialDevices);
      } catch (err) {
        console.error("Error fetching initial device data:", err);
      }
    };

    loadInitialDevices();
  }, []);

  const handleNextDay = async () => {
    try {
      const updatedDevices = await SetNextDay({
        powerPercent,
        rationLevel,
        o2Threshold,
        scavengeAtNight,
        coolDownAtNight,
      });
      setDevices(updatedDevices);

      // Reset nightly toggles after advancing the day.
      setScavengeAtNightState(false);
      setCoolDownAtNight(false);
    } catch (err) {
      console.error("Error advancing to next day:", err);
      Alert.alert("Couldn't query devices!");
    }
  };

  return (
    <View style={[styles.viewport, { backgroundColor }]}>
      <View
        style={[
          styles.scaleWrapper,
          { backgroundColor, transform: [{ scale }] },
        ]}
      >
        <View style={[styles.container, { backgroundColor }]}>
          {/* FULL-WIDTH HEALTH BAR */}
          <View style={styles.healthContainer} data-testid="health-value">
            <HealthMonitor value={getValue(DeviceType.HealthMonitorType)} />
          </View>

          {/* MAIN CONTENT ROW */}
          <View style={styles.mainRow}>
            {/* LEFT CLUSTER */}
            <View style={styles.leftColumn}>
              <View style={styles.resourceRow}>
                {/* FOOD */}
                <View style={styles.resourceModule} data-testid="food-value">
                  <FoodMonitor value={foodValue} />
                </View>

                {/* WATER */}
                <View style={styles.resourceModule} data-testid="water-value">
                  <WaterSensor value={getValue(DeviceType.WaterSensor)} />
                </View>

                {/* GENERATOR POWER CONTROL */}
                <View style={styles.resourceModule}>
                  <LightSwitch
                    value={powerPercent}
                    onChange={setPowerPercent}
                    lightsOn={lightsOn}
                  />
                </View>

                {/* GENERATOR */}
                <View
                  style={styles.resourceModule}
                  data-testid="generator-value"
                >
                  <Generator value={getValue(DeviceType.GeneratorType)} />
                </View>

                {/* O2 SCRUBBER + THRESHOLD */}
                <View
                  style={styles.resourceModule}
                  data-testid="o2scrubber-value"
                >
                  <OxygenScrubber value={getValue(DeviceType.O2Scrubber)} />
                  <OxygenScrubberThreshold
                    value={o2Threshold}
                    onChange={setO2ThresholdState}
                  />
                </View>
              </View>
            </View>

            {/* RIGHT: EXTERIOR VALUES + COOL DOWN */}
            <View style={styles.exteriorBox}>
              <Text style={styles.exteriorTitle}>Exterior Values</Text>

              {/* THERMOMETER WITH HOT BACKGROUND WHEN > 35 */}
              <View
                style={[
                  styles.exteriorItem,
                  thermometerValue >= 35 && styles.exteriorItemHot,
                ]}
                data-testid="thermometer-value"
              >
                <Thermometer value={thermometerValue} />
              </View>

              {/* COOL DOWN AT NIGHT TOGGLE NEAR TEMPERATURE */}
              <View style={styles.coolDownWrapper}>
                <CoolDown
                  value={coolDownAtNight}
                  onChange={setCoolDownAtNight}
                />
              </View>

              <View style={styles.exteriorItem} data-testid="dosimeter-value">
                <Dosimeter value={getValue(DeviceType.DosimeterType)} />
              </View>
            </View>
          </View>

          {/* BOTTOM BAR */}
          <View style={styles.bottomRow}>
            {/* RATION LEVEL */}
            <RationLevel
              value={rationLevel}
              onChange={setRationLevelState}
            />

            {/* SCAVENGE + NEXT DAY */}
            <View style={styles.bottomRightColumn}>
              <ScavengeToggle
                value={scavengeAtNight}
                onChange={setScavengeAtNightState}
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
  exteriorItemHot: {
    backgroundColor: "#802020",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  coolDownWrapper: {
    marginTop: 4,
    marginBottom: 8,
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
