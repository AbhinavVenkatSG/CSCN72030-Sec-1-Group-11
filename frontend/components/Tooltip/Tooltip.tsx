import React, { ReactNode, useEffect, useRef, useState } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

type TooltipProps = {
  text: string;
  children: ReactNode;
  delayMs?: number;
  style?: StyleProp<ViewStyle>;
  placement?: "above" | "below";
};

const DEFAULT_DELAY_MS = 1000;

export default function Tooltip({
  text,
  children,
  delayMs = DEFAULT_DELAY_MS,
  style,
  placement = "above",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleHoverIn = () => {
    clearTimer();
    timerRef.current = setTimeout(() => setVisible(true), delayMs);
  };

  const handleHoverOut = () => {
    clearTimer();
    setVisible(false);
  };

  useEffect(() => clearTimer, []);

  const hoverHandlers = {
    onMouseEnter: handleHoverIn,
    onMouseLeave: handleHoverOut,
    onHoverIn: handleHoverIn,
    onHoverOut: handleHoverOut,
  } as any;

  const containerStyle =
    placement === "below"
      ? [styles.tooltipContainer, styles.tooltipContainerBelow]
      : [styles.tooltipContainer, styles.tooltipContainerAbove];

  return (
    <View
      style={[styles.wrapper, style]}
      // Spread to avoid type friction in RN (hover-only on web/desktop)
      {...hoverHandlers}
    >
      {children}

      {visible && (
        <View pointerEvents="none" style={containerStyle}>
          <View style={styles.tooltipBubble}>
            {text.split("\n").map((line, index) => (
              <Text key={`${index}-${line}`} style={styles.tooltipText}>
                {line}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignItems: "center",
  },
  tooltipContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 50,
  },
  tooltipContainerAbove: {
    bottom: "100%",
    paddingBottom: 8,
  },
  tooltipContainerBelow: {
    top: "100%",
    paddingTop: 8,
  },
  tooltipBubble: {
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderColor: "#9dc2ff",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 240,
    maxWidth: 420,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "left",
  },
});
