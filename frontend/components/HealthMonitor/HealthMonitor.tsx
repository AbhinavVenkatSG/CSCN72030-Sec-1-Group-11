import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type Props = { value: number; label?: string };

export default function HealthBar({ value, label = "Health" }: Props) {
  const anim = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: value, duration: 250, useNativeDriver: false }).start();
  }, [value]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });

  const color =
    value < 50 ? "#e74c3c" : value < 75 ? "#f1c40f" : "#2ecc71"; // simple thresholds

  return (
    <View style={s.card}>
      <Text style={s.title}>{label}</Text>
      <View style={s.track}>
        <Animated.View style={[s.fill, { width, backgroundColor: color }]} />
        <Text style={s.value}>{Math.round(value)}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    gap: 6,
    alignSelf: "stretch",
  },
  title: { color: "#fff", fontWeight: "600" },
  track: {
    height: 24,
    width: "100%",
    backgroundColor: "#222",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
  },
  fill: { height: "100%" },
  value: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
});
