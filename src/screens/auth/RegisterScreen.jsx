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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleRegister = () => {
    if (!agreedToTerms) {
      console.log("Please accept the Terms and Conditions");
      return;
    }

    console.log({
      name,
      emailOrPhone,
      password,
    });

    navigation.navigate("VerifyContact");
  };

  const handleGoogleRegister = () => {
    console.log("Google OAuth");
  };

  const handleAppleRegister = () => {
    console.log("Apple OAuth");
  };

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
        {/* Header */}
        <AuthHeader
          title="Create your account."
          description="Join Gist and start connecting with people."
        />

        {/* Full Name */}
        <AuthInput
          placeholder="Full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        {/* Email / Phone */}
        <AuthInput
          placeholder="Email or phone number"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <View style={styles.passwordContainer}>
          <AuthInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />

          <Pressable
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={COLORS.textSecondary}
            />
          </Pressable>
        </View>

        {/* Terms & Conditions */}
        <Pressable
          style={styles.termsContainer}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
        >
          <View
            style={[styles.checkbox, agreedToTerms && styles.checkboxActive]}
          >
            {agreedToTerms && (
              <Ionicons name="checkmark" size={15} color={COLORS.black} />
            )}
          </View>

          <Text style={styles.termsText}>
            I agree to the{" "}
            <Text style={styles.termsLink}>Terms and Conditions</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </Pressable>

        {/* Create Account */}
        <AuthButton title="Create Account" onPress={handleRegister} />

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />

          <Text style={styles.dividerText}>OR</Text>

          <View style={styles.divider} />
        </View>

        {/* Google */}
        <Pressable style={styles.socialButton} onPress={handleGoogleRegister}>
          <Ionicons name="logo-google" size={19} color={COLORS.text} />

          <Text style={styles.socialText}>Continue with Google</Text>
        </Pressable>

        {/* Apple */}
        <Pressable style={styles.socialButton} onPress={handleAppleRegister}>
          <Ionicons name="logo-apple" size={20} color={COLORS.text} />

          <Text style={styles.socialText}>Continue with Apple</Text>
        </Pressable>

        {/* Login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>

          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Log in</Text>
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

  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
    marginBottom: 8,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  checkboxActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },

  termsText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  termsLink: {
    color: COLORS.text,
    fontWeight: "600",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  dividerText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginHorizontal: 12,
  },

  socialButton: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: COLORS.surface,
  },

  socialText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 9,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
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
