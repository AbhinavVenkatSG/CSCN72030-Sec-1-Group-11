import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type CoolDownProps = {
  value: boolean;
  onChange: (newValue: boolean) => void;
};

const CoolDown: React.FC<CoolDownProps> = ({ value, onChange }) => {
  return (
    <Pressable
      style={[styles.container, value && styles.containerOn]}
      onPress={() => onChange(!value)}
    >
      <Text style={styles.label}>💦 Cool Down</Text>

      <View style={styles.switchTrack}>
        <View
          style={[
            styles.switchThumb,
            value && styles.switchThumbOn,
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#888",
    backgroundColor: "#333",
  },
  containerOn: {
    borderColor: "#2163aeff",
    backgroundColor: "#184188ff",
  },
  label: {
    color: "#fff",
    marginRight: 6,   // smaller gap
    fontSize: 11,     // 🔹 smaller text than Scavenge
    fontWeight: "500",
  },
  switchTrack: {
    width: 46,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#555",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ccc",
    transform: [{ translateX: 0 }],
  },
  switchThumbOn: {
    backgroundColor: "#184188ff",
    transform: [{ translateX: 20 }],
  },
});

export default CoolDown;