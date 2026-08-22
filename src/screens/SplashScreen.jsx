import { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import COLORS from "../constants/colors";
import { images } from "../../assets/assets";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("GetStarted");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.tagline}>Connect. Chat. Share.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 120,
    height: 120,
  },

  tagline: {
    position: "absolute",
    bottom: 40,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});
