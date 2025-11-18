// components/RationLevel/RationLevel.tsx

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type RationLevelValue = "low" | "medium" | "high";

export type RationLevelProps = {
  value: RationLevelValue;
  onChange: (level: RationLevelValue) => void;
};

const RationLevel: React.FC<RationLevelProps> = ({ value, onChange }) => {
  const renderButton = (level: RationLevelValue, label: string) => {
    const selected = value === level;
    return (
      <Pressable
        key={level}
        onPress={() => onChange(level)}
        style={[
          styles.rationButton,
          selected && styles.rationButtonSelected,
        ]}
      >
        <Text
          style={[
            styles.rationButtonText,
            selected && styles.rationButtonTextSelected,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.rationRow}>
      <Text style={styles.rationLabel}>Ration Level</Text>
      <View style={styles.rationButtonsRow}>
        {renderButton("low", "Low")}
        {renderButton("medium", "Mid")}
        {renderButton("high", "High")}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rationRow: {
    alignSelf: "flex-start",   // left side
  },
  rationLabel: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  rationButtonsRow: {
    flexDirection: "row",
  },
  rationButton: {
    borderWidth: 2,
    borderColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 8,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: "#3a3a3a",
  },
  rationButtonSelected: {
    backgroundColor: "#ff9ea8",
  },
  rationButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  rationButtonTextSelected: {
    color: "#000",
    fontWeight: "700",
  },
});

export default RationLevel;