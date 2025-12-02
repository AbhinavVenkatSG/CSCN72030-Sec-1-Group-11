import LightSwitch from "@/components/LightSwitch/LightSwitch";
import NextDay from "@/components/NextDay/NextDay";
import RationLevel, {
  RationLevelValue,
} from "@/components/RationLevel/RationLevel";
import Toast from "@/components/Toast/Toast";
import Tooltip from "@/components/Tooltip/Tooltip";
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
const TOAST_DURATION_MS = 4000;

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

const TOOLTIP_TEXT = {
  health:
    "Tracks overall bunker wellbeing.\nDrops faster when lights are off or key resources run out.",
  foodMonitor:
    "Shows how much food remains in storage.\nFood drains each day in exchange for health. You take damage if food lvl = 0.\nRation level changes how fast it's used (?? ration = ?? usage = ?? healing).\nScavenging can bring in extra food.",
  waterLevel:
    "Shows drinking water remaining.\nWater drains daily, damage if water lvl = 0.\nCooling the bunker uses extra water.\nScavenging can bring in extra water.",
  lightThreshold:
    "Controls when the lights shut off to save gas.\nIf gas falls below this %, the lights turn off automatically.\nLights being off = all damage is doubled.",
  generator:
    "Shows remaining gasoline for power.\nGas drains each day.\nHigher O2 scrubber power uses more gas.\nLights off = slower gas use.\nScavenging can add extra gas.",
  o2Scrubber:
    "Shows current oxygen level.\nOxygen drains each day, big damage if o2 lvl = 0.\nOxygen changes daily based on scrubber power.\nHigher power = better oxygen but more fuel use.",
  scrubberPower:
    "Controls how hard the O2 scrubber runs.\n?? Power = ?? oxygen gain but ?? gas usage.\n?? Power = slower oxygen recovery, less fuel used.",
  exteriorTemperature:
    "Shows outdoor temperature.\nTemp 35 or above will harm wellbeing unless cooling is enabled.",
  coolDown:
    "Uses extra water to cool the bunker at night.\nPrevents heat damage if temps are high.",
  radiationLevel:
    "Shows outside radiation.\nHigher radiation makes scavenging damage wellbeing more.",
  rationLevel:
    "Controls how much food is consumed daily.\nLow = slow food use, low well-being gain.\nMid = normal food use, normal gain.\nHigh = fast food use, high gain.",
  scavengeAtNight:
    "Send a team to search for supplies.\nCan increase food, water, and gas.\nYou take damage relative to the current radiation level.",
  nextDay:
    "Advances one cycle.\nAll devices update in with their new daily values.",
};

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);

  const [devices, setDevices] = useState<DeviceStatus[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    if (!toastMessage) return;

    const timer = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toastMessage]);

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
            <Tooltip
              text={TOOLTIP_TEXT.health}
              style={styles.fullWidthTooltip}
              placement="below"
            >
              <HealthMonitor value={getValue(DeviceType.HealthMonitorType)} />
            </Tooltip>
          </View>

          {/* MAIN CONTENT ROW */}
          <View style={styles.mainRow}>
            {/* LEFT CLUSTER */}
            <View style={styles.leftColumn}>
              <View style={styles.resourceRow}>
                {/* FOOD */}
                <View style={styles.resourceModule} data-testid="food-value">
                  <Tooltip text={TOOLTIP_TEXT.foodMonitor}>
                    <FoodMonitor value={foodValue} />
                  </Tooltip>
                </View>

                {/* WATER */}
                <View style={styles.resourceModule} data-testid="water-value">
                  <Tooltip text={TOOLTIP_TEXT.waterLevel}>
                    <WaterSensor value={getValue(DeviceType.WaterSensor)} />
                  </Tooltip>
                </View>

                {/* GENERATOR POWER CONTROL */}
                <View style={styles.resourceModule}>
                  <Tooltip text={TOOLTIP_TEXT.lightThreshold}>
                    <LightSwitch
                      value={powerPercent}
                      onChange={setPowerPercent}
                      lightsOn={lightsOn}
                    />
                  </Tooltip>
                </View>

                {/* GENERATOR */}
                <View
                  style={styles.resourceModule}
                  data-testid="generator-value"
                >
                  <Tooltip text={TOOLTIP_TEXT.generator}>
                    <Generator value={getValue(DeviceType.GeneratorType)} />
                  </Tooltip>
                </View>

                {/* O2 SCRUBBER + THRESHOLD */}
                <View
                  style={styles.resourceModule}
                  data-testid="o2scrubber-value"
                >
                  <Tooltip text={TOOLTIP_TEXT.o2Scrubber}>
                    <OxygenScrubber value={getValue(DeviceType.O2Scrubber)} />
                  </Tooltip>
                  <Tooltip text={TOOLTIP_TEXT.scrubberPower}>
                    <OxygenScrubberThreshold
                      value={o2Threshold}
                      onChange={setO2ThresholdState}
                    />
                  </Tooltip>
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
                <Tooltip text={TOOLTIP_TEXT.exteriorTemperature}>
                  <Thermometer value={thermometerValue} />
                </Tooltip>
              </View>

              {/* COOL DOWN AT NIGHT TOGGLE NEAR TEMPERATURE */}
              <View style={styles.coolDownWrapper}>
                <Tooltip text={TOOLTIP_TEXT.coolDown}>
                  <CoolDown
                    value={coolDownAtNight}
                    onChange={setCoolDownAtNight}
                  />
                </Tooltip>
              </View>

              <View style={styles.exteriorItem} data-testid="dosimeter-value">
                <Tooltip text={TOOLTIP_TEXT.radiationLevel}>
                  <Dosimeter value={getValue(DeviceType.DosimeterType)} />
                </Tooltip>
              </View>
            </View>
          </View>

          {/* BOTTOM BAR */}
          <View style={styles.bottomRow}>
            {/* RATION LEVEL */}
            <Tooltip text={TOOLTIP_TEXT.rationLevel}>
              <RationLevel
                value={rationLevel}
                onChange={setRationLevelState}
              />
            </Tooltip>

            {/* SCAVENGE + NEXT DAY */}
            <View style={styles.bottomRightColumn}>
              <Tooltip text={TOOLTIP_TEXT.scavengeAtNight}>
                <ScavengeToggle
                  value={scavengeAtNight}
                  onChange={setScavengeAtNightState}
                />
              </Tooltip>
              <Tooltip text={TOOLTIP_TEXT.nextDay}>
                <NextDay onPress={handleNextDay} />
              </Tooltip>
            </View>
          </View>
        </View>
      </View>
      {toastMessage && <Toast message={toastMessage} />}
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
    alignItems: "stretch",
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
  fullWidthTooltip: {
    width: "100%",
    alignSelf: "stretch",
    alignItems: "stretch",
    flex: 1,
  },
});
