import Dosimeter from "@/components/Dosimeter/Dosimeter";
import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LiveGeneratorComponent, STATIC_GENERATOR } from "../../components/Generator/LiveGenerator";
import HealthBar from "../../components/HealthMonitor/HealthMonitor";
import { OxygenScrubberComponent, STATIC_OXYGEN } from "../../components/OxygenScrubber/OxygenScrubber";
import Thermometer from "../../components/Thermometer/Thermometer";

const BASE_WIDTH = 1024;
const BASE_HEIGHT = 768;

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);

  return (
    <View style={styles.viewport}>
      <View style={[styles.scaleWrapper, { transform: [{ scale }] }]}>
        <View style={styles.container}>
          {/* Centered health bar at top */}
          <View style={styles.healthContainer}>
            <HealthBar value={67} />
          </View>

          {/* Centered power & atmosphere controls */}
          <View style={styles.resourceRow}>
            <View style={styles.resourceModule}>
              <LiveGeneratorComponent value={STATIC_GENERATOR} />
            </View>

            <View style={styles.resourceModule}>
              <OxygenScrubberComponent value={STATIC_OXYGEN} />
            </View>
          </View>

          {/* Right-side "Exterior Values" box */}
          <View style={styles.exteriorBox}>
            <Text style={styles.exteriorTitle}>Exterior Values</Text>

            <View style={styles.exteriorItem}>
              <Thermometer value={67} />
            </View>

            <View style={styles.exteriorItem}>
              <Dosimeter value={67} />
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
  healthTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,                
    textAlign: "center",
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
    alignItems: "center"
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
  label: {
    color: "#fff",
    marginBottom: 4,
  },
  value: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
