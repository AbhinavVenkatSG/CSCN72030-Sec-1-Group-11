import React from "react";
import { StyleSheet, Text, View } from "react-native";
import HealthBar from "../../components/HealthMonitor/HealthMonitor";
import Thermometer from "../../components/Thermometer/Thermometer";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Centered health bar at top */}
      <View style={styles.healthContainer}>
        <HealthBar value={67} />
      </View>

      {/* Right-side "Exterior Values" box */}
      <View style={styles.exteriorBox}>
        <Text style={styles.exteriorTitle}>Exterior Values</Text>

        <View style={styles.exteriorItem}>
          <Thermometer value={67} />
        </View>

        <View style={styles.exteriorItem}>
          {/* Placeholder for Radiation component */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  healthContainer: {
    marginTop: 12,
    alignSelf: "stretch",
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
