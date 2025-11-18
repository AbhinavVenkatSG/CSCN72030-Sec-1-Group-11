import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export type OxygenScrubberThresholdProps = {
  value: number; // 0–100
  onChange: (newValue: number) => void;
  onApply?: () => void; // called when user finishes editing (blur or tap)
};

export default function OxygenScrubberThreshold({
  value,
  onChange,
  onApply,
}: OxygenScrubberThresholdProps) {
  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    const numericValue = cleaned === "" ? 0 : parseInt(cleaned, 10);
    const clamped = Math.max(0, Math.min(100, numericValue));
    onChange(clamped);
  };

  return (
    <View style={styles.container}>

      {/* tap anywhere on the box OR blur input to apply */}
      <Pressable>
        <View style={styles.box}>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(value)}
            onChangeText={handleChangeText}
            onBlur={onApply}
            maxLength={3}
          />

          <Text style={styles.percentSymbol}>%</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 0 },
  label: { color: "#fff", fontSize: 12 },
  box: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: -50,
  },
  symbol: {
    color: "#fff",
    fontSize: 32,
    marginRight: 6,
  },
  input: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    width: 48,
    textAlign: "center",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  percentSymbol: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 4,
  },
});