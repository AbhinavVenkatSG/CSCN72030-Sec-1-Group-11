import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Thermometer({ value }: { value: number }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Temperature</Text>
      <View style={styles.box}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.symbol}>°C</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  label: { color: "#fff", marginBottom: 4 },
  box: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  value: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  symbol: { color: "#fff", fontSize: 14, marginLeft: 4, marginTop: 2 },
});
