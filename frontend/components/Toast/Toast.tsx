import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ToastProps = {
  message: string;
};

const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <View style={styles.toastWrapper} pointerEvents="none">
      <View style={styles.toast}>
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toast: {
    backgroundColor: "#2e2e2e",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ee3434ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  toastText: {
    color: "#ffe6e6",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Toast;
