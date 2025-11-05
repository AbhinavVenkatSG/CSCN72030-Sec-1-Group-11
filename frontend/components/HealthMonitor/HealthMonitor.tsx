import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
// Optional: centralize your colors in a theme file and import them.
// For now, inlined to keep this file standalone:
const BAR_COLORS = ["#ff1900ff", "#ffcc00ff", "#00ff6aff"] as const;

type Props = {
  value: number;          // 0..100
  label?: string;         // default "Health"
  showLabel?: boolean;    // default true
  height?: number;        // bar height (default 24)
  radius?: number;        // corner radius (default 12)
};

export default function HealthBar({
  value,
  label = "Health",
  showLabel = true,
  height = 24,
  radius = 12,
}: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const anim = useRef(new Animated.Value(clamped)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: clamped, duration: 250, useNativeDriver: false }).start();
  }, [clamped]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });
  const color = anim.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [BAR_COLORS[0], BAR_COLORS[1], BAR_COLORS[2]], // red → yellow → green
  });

  return (
    <View style={styles.card}>
      {showLabel && <Text style={styles.title}>{label}</Text>}

      <View style={[styles.track, { height, borderRadius: radius }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width,
              backgroundColor: color,
              borderTopLeftRadius: radius,
              borderBottomLeftRadius: radius,
              // round right corners only when near 100% to avoid clipping
              borderTopRightRadius:  clamped > 98 ? radius : 0,
              borderBottomRightRadius: clamped > 98 ? radius : 0,
            },
          ]}
        />
        <Text style={styles.value}>{Math.round(clamped)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "stretch",
    gap: 6,
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20, 
    textAlign: "center",
    alignSelf: "center",
    width: "100%",
    textShadowColor: "rgba(255,255,255,0.9)", // glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  track: {
    backgroundColor: "#333",
    overflow: "hidden",
    justifyContent: "center",
  },
  fill: {
    height: "100%"
  },
  value: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    textShadowColor: "rgba(0, 0, 0, 0.95)", // white glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});