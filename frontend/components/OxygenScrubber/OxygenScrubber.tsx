import { StyleSheet, Text, View } from "react-native";

type Props = { value: number };

function boundsCheck(value: number) {
  return Math.max(0, Math.min(100, value));
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  box: {
    height: 200,
    width: 150,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  fill: { width: "100%" },
  value: {
    color: "#222",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 14,
    textAlign: "center",
    marginTop: -25,
  },
  label: {
    color: "#ddd",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
    marginTop: 15,
  },
});

export default function OxygenScrubber({ value }: Props) {
  const safeValue = Math.round(boundsCheck(value));

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View
          style={[
            styles.fill,
            {
              height: `${safeValue}%`,
              backgroundColor: "#26C6DA",
            },
          ]}
        />
      </View>
      <Text style={styles.value}>{safeValue}%</Text>
      <Text style={styles.label}> O₂ Scrubber</Text>
    </View>
  );
}