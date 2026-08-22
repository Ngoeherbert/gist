import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colors";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import { useAppStore } from "../../store/useAppStore";

export default function LoginScreen({ navigation }) {
  // ==================================================
  // ZUSTAND
  // ==================================================

  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);

  // ==================================================
  // LOCAL UI STATE
  // ==================================================

  const [email, setEmail] = useState(profile?.email || "");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // ==================================================
  // LOGIN
  // ==================================================

  const handleLogin = () => {
    const identifier = email.trim();

    if (!identifier) {
      return;
    }

    /*
     * Save the login identifier into Zustand.
     *
     * We don't save the password in the profile store.
     */
    updateProfile({
      email: identifier,
    });

    /*
     * Authentication will be connected here later.
     *
     * Example:
     *
     * await login(identifier, password);
     */

    console.log("Login:", {
      email: identifier,
      password,
    });
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <AuthHeader
          title="Welcome back."
          description="Log in to continue to your Gist account."
        />

        {/* EMAIL / PHONE */}

        <AuthInput
          placeholder="Email or phone number"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* PASSWORD */}

        <View style={styles.passwordContainer}>
          <AuthInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />

          <Pressable
            style={styles.eyeButton}
            onPress={() => setShowPassword((current) => !current)}
            hitSlop={8}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={COLORS.textSecondary}
            />
          </Pressable>
        </View>

        {/* FORGOT PASSWORD */}

        <Pressable
          style={styles.forgotButton}
          onPress={() =>
            navigation.navigate("ForgotPassword", {
              contact: email.trim(),
            })
          }
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        {/* LOGIN */}

        <AuthButton title="Log In" onPress={handleLogin} />

        {/* FOOTER */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>

          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Create one</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  passwordContainer: {
    position: "relative",
  },

  eyeButton: {
    position: "absolute",
    right: 16,
    top: 15,
    zIndex: 2,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 14,
    paddingVertical: 4,
  },

  forgotText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  footerText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  link: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },
});
