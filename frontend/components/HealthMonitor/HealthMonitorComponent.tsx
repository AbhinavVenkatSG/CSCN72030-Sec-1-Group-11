import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type Props = { value: number; label?: string };

export default function HealthBar({ value, label = "Health" }: Props) {
  const anim = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: value, duration: 300, useNativeDriver: false }).start();
  }, [value]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });
  const color = anim.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ["#e74c3c", "#f1c40f", "#2ecc71"], // red → yellow → green
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{label}</Text>
      <View style={styles.wrap}>
        <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
        <Text style={styles.valueText}>{Math.round(value)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 6 },
  title: { color: "#fff", fontWeight: "600" },
  wrap: {
    height: 24,
    backgroundColor: "#222",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
  },
  fill: { height: "100%" },
  valueText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});