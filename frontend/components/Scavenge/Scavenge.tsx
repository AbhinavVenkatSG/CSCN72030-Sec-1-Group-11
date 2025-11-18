import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type ScavengeToggleProps = {
  value: boolean;
  onChange: (newValue: boolean) => void;
};

const ScavengeToggle: React.FC<ScavengeToggleProps> = ({ value, onChange }) => {
  return (
    <Pressable
      style={[styles.container, value && styles.containerOn]}
      onPress={() => onChange(!value)}
    >
      <Text style={styles.label}>Scavenge At Night</Text>

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
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#888",
    backgroundColor: "#333",
  },
  containerOn: {
    borderColor: "#4CAF50",
    backgroundColor: "#244b2a",
  },
  label: {
    color: "#fff",
    marginRight: 10,
    fontSize: 14,
    fontWeight: "600",
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
    backgroundColor: "#4CAF50",
    transform: [{ translateX: 20 }],
  },
});

export default ScavengeToggle;