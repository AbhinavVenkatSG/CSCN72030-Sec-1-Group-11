// components/NextDay/NextDay.tsx

import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export type NextDayProps = {
  onPress: () => void;
};

const NextDay: React.FC<NextDayProps> = ({ onPress }) => {
  return (
    <Pressable style={styles.nextDayButton} onPress={onPress}>
      <Text style={styles.nextDayText}>Next Day</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  nextDayButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  nextDayText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "700",
  },
});

export default NextDay;