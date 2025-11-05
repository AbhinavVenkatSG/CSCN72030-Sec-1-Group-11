import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

type LabelPosition = "below" | "above" | "left";

type Props = {
  value: number;                  // 0..100 (clamped internally)
  label?: string;                 // default "Generator"
  style?: StyleProp<ViewStyle>;   // wrapper styles
  labelPosition?: LabelPosition;  // below | above | left
  labelOffset?: number;           // px spacing
  showValue?: boolean;            // show numeric value
};

const TRACK_HEIGHT = 200;
const TRACK_WIDTH  = 150;

export default function LiveGeneratorComponent({
  value,
  label = "Generator",
  style,
  labelPosition = "below",
  labelOffset = -30,
  showValue = true,
}: Props) {
  const safe = Math.max(0, Math.min(100, value));
  const anim = useRef(new Animated.Value(safe)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: safe, duration: 250, useNativeDriver: false }).start();
  }, [safe]);

  const height = anim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });
  const color = anim.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ["#ff1900ff", "#ffcc00ff", "#00ff6aff"],
  });

  const NumberValue = showValue ? (
    <Text style={[styles.value, { marginTop: labelOffset }]}>{Math.round(safe)}</Text>
  ) : null;

  const Label = (
    <Text
      style={[
        styles.label,
        labelPosition !== "left" ? { marginTop: labelOffset } : { marginRight: labelOffset },
      ]}
    >
      {label}
    </Text>
  );

  const Bar = (
    <View style={styles.wrap}>
      <Animated.View style={[styles.fill, { height, backgroundColor: color }]} />
    </View>
  );

  let content: React.ReactNode;
  if (labelPosition === "left") {
    content = (
      <View style={styles.row}>
        {Label}
        <View style={styles.colCenter}>
          {Bar}
          {NumberValue}
        </View>
      </View>
    );
  } else if (labelPosition === "above") {
    content = (
      <View style={styles.colCenter}>
        <Text style={[styles.label, { marginBottom: labelOffset }]}>{label}</Text>
        {Bar}
        {NumberValue}
      </View>
    );
  } else {
    content = (
      <View style={styles.colCenter}>
        {Bar}
        {NumberValue}
        {Label}
      </View>
    );
  }

  return <View style={[styles.root, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  root: { alignSelf: "flex-start" },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  colCenter: { flexDirection: "column", alignItems: "center" },
  wrap: {
    height: TRACK_HEIGHT,
    width: TRACK_WIDTH,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "column-reverse",
  },
  fill: { width: "100%" },
  value: {
    color: "#222",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 14,
    textAlign: "center",
  },
  label: {
    color: "#222",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 16,
    textAlign: "center",
  },
});