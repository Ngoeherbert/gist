import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

import COLORS from "../../constants/colors";
import { images } from "../../../assets/assets";

export default function AuthHeader({ title, description }) {
  return (
    <View style={styles.container}>
      <Image
        source={images.logo}
        style={styles.logo}
        contentFit="contain"
        cachePolicy="memory-disk"
      />

      <Text style={styles.title}>{title}</Text>

      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },

  logo: {
    width: 70,
    height: 70,
    marginBottom: 18,
  },

  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.5,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 320,
    marginTop: 8,
  },
});
