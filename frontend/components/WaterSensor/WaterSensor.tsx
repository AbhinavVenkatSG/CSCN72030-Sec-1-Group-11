// Rami Musleh 
// May have to implement WaterSensorEngine later

import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = { value: number };

const BAR_COLORS = [
  { stop: 0, color: [255, 25, 0, 255] },
  { stop: 50, color: [255, 204, 0, 255] },
  { stop: 100, color: [0, 255, 106, 255] },
];

export default function WaterSensor({ value }: Props) {
  value = Math.round(boundsCheck(value));
  const fillColor = getFillColor(value);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={[styles.fill, { height: `${value}%`, backgroundColor: fillColor }]} />
      </View>
      <Text style={styles.value}>{value}%</Text>
      <Text style={styles.label}>💧 Water Sensor</Text>
    </View>
  );
}

function boundsCheck(value: number) {
  return Math.max(0, Math.min(100, value));
}

function getFillColor(value: number) {
  const [start, end] = value <= 50 ? [BAR_COLORS[0], BAR_COLORS[1]] : [BAR_COLORS[1], BAR_COLORS[2]];
  const range = end.stop - start.stop || 1;
  const t = (value - start.stop) / range;
  const interpolated = start.color.map((component, index) => {
    const delta = end.color[index] - component;
    return Math.round(component + delta * t);
  });
  return `rgba(${interpolated[0]}, ${interpolated[1]}, ${interpolated[2]}, ${interpolated[3] / 255})`;
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  box: {
    height: 200,
    width: 150,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  fill: { width: "100%" },
  value: {
    color: "#222",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 14,
    textAlign: "center",
    marginTop: -25,
  },
  label: {
    color: "#ddd",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
    marginTop: 15,
  },
});
