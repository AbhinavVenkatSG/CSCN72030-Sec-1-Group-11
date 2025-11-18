import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export type OxygenScrubberThresholdProps = {
  value: number;                 // 0–100
  onChange: (newValue: number) => void;
  onApply?: () => void;          // called when user taps the control
};

export default function OxygenScrubberThreshold({
  value,
  onChange,
  onApply,
}: OxygenScrubberThresholdProps) {
  const handleChangeText = (text: string) => {
    // keep only digits
    const cleaned = text.replace(/[^0-9]/g, "");
    const numericValue = cleaned === "" ? 0 : parseInt(cleaned, 10);

    // clamp 0–100
    const clamped = Math.max(0, Math.min(100, numericValue));
    onChange(clamped);
  };

  return (
    <View style={styles.container}>

      {/* tap anywhere on the box to apply the setting */}
      <Pressable onPress={onApply}>
        <View style={styles.box}>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(value)}
            onChangeText={handleChangeText}
            maxLength={3} // 0–100
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
    marginBottom: -50,
    marginTop: 5,
  },
  symbol: {
    color: "#fff",
    fontSize: 32, // bigger icon
    marginRight: 6,
  },
  input: {
    color: "#fff",
    fontSize: 26,  // bigger text
    fontWeight: "bold",
    width: 48,     // compact textbox
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