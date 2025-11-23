import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export type LightSwitchProps = {
  value: number; // 0-100
  onChange: (newValue: number) => void;
  onApply?: () => void; // called when user finishes editing (blur or tap)
  lightsOn?: boolean;
};

export default function LightSwitch({
  value,
  onChange,
  onApply,
  lightsOn = false,
}: LightSwitchProps) {
  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    const numericValue = cleaned === "" ? 0 : parseInt(cleaned, 10);
    const clamped = Math.max(0, Math.min(100, numericValue));
    onChange(clamped);
  };

  // Emoji style flips between lit (emoji) and text-style unlit bulb.
  const bulbSymbol = lightsOn ? "💡" : "💡︎";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Light Threshold</Text>

      {/* tap anywhere on the box OR blur input to apply */}
      <Pressable>
        <View style={styles.box}>
          <Text style={[styles.symbol, !lightsOn && styles.symbolOff]}>
            {bulbSymbol}
          </Text>

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
  container: { alignItems: "center" },
  label: { color: "#fff", marginBottom: 4, fontSize: 12 },
  box: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  symbol: {
    color: "#fff",
    fontSize: 32,
    marginRight: 6,
  },
  symbolOff: {
    color: "#888",
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
