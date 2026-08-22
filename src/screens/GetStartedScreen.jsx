import { View, Text, Image, Pressable, StyleSheet } from "react-native";

import COLORS from "../constants/colors";
import { images } from "../../assets/assets";

export default function GetStartedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Welcome to Gist.</Text>

        <Text style={styles.description}>
          Connect with people, share your world, and make every conversation
          count.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginBold}>Log in</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 110,
    height: 110,
    marginBottom: 24,
  },

  title: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 340,
    marginTop: 16,
  },

  actions: {
    gap: 20,
  },

  button: {
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "700",
  },

  loginText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },

  loginBold: {
    color: COLORS.text,
    fontWeight: "600",
  },
});
