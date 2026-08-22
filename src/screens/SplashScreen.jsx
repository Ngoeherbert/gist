import { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import COLORS from "../constants/colors";
import { images } from "../../assets/assets";
import useAppStore from "../store/useAppStore";

export default function SplashScreen({ navigation }) {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  const profile = useAppStore((state) => state.profile);

  useEffect(() => {
    const timer = setTimeout(() => {
      /*
       * Returning authenticated users
       * go directly to Home.
       */
      if (isAuthenticated && profile?.onboardingCompleted) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });

        return;
      }

      /*
       * Otherwise start the normal
       * authentication/onboarding flow.
       */
      navigation.replace("GetStarted");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated, profile?.onboardingCompleted]);

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
