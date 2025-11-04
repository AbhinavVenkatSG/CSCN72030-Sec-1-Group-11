import React from "react";
import { StyleSheet, View } from "react-native";
import { HealthBar, STATIC_HEALTH } from "../../GUIDevices/HealthMonitor/HealthMonitor";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HealthBar value={STATIC_HEALTH} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-start",
    gap: 12,
  },
});