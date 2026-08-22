import { Pressable, Text, StyleSheet } from "react-native";

import COLORS from "../../constants/colors";

export default function AuthButton({ title, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  text: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: "700",
  },
});
