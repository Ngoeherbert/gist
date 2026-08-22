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
import { SafeAreaView } from "react-native-safe-area-context";

import COLORS from "../../constants/colors";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import useAuthStore from "../../store/useAuthStore";

export default function RegisterScreen({ navigation }) {
  // ==========================================
  // ZUSTAND
  // ==========================================

  const updateProfile = useAuthStore(
    (state) => state.updateProfile,
  );

  const profile = useAuthStore(
    (state) => state.profile,
  );

  // ==========================================
  // LOCAL FORM STATE
  // ==========================================

  // Password intentionally stays local.
  // We do not persist passwords in Zustand.

  const [name, setName] = useState(
    profile?.name || "",
  );

  const [email, setEmail] = useState(
    profile?.email || "",
  );

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [agreedToTerms, setAgreedToTerms] =
    useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // VALIDATION
  // ==========================================

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value.trim(),
    );
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = () => {
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // ------------------------------------------
    // NAME
    // ------------------------------------------

    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }

    // ------------------------------------------
    // EMAIL
    // ------------------------------------------

    if (!cleanEmail) {
      setError(
        "Please enter your email address.",
      );
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError(
        "Please enter a valid email address.",
      );
      return;
    }

    // ------------------------------------------
    // PASSWORD
    // ------------------------------------------

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters.",
      );
      return;
    }

    // ------------------------------------------
    // TERMS
    // ------------------------------------------

    if (!agreedToTerms) {
      setError(
        "Please accept the Terms and Conditions.",
      );
      return;
    }

    // ==========================================
    // SAVE REGISTRATION DATA
    // ==========================================

    updateProfile({
      name: cleanName,
      email: cleanEmail,

      emailVerified: false,

      onboardingCompleted: false,
    });

    console.log("Registration:", {
      name: cleanName,
      email: cleanEmail,
    });

    /*
     * Password is intentionally NOT stored
     * in Zustand.
     *
     * When the backend is connected, the password
     * will be sent securely to the registration API.
     */

    // ==========================================
    // EMAIL VERIFICATION
    // ==========================================

    navigation.navigate("VerifyContact", {
      contact: cleanEmail,
      method: "email",
      purpose: "registration",
    });
  };

  // ==========================================
  // GOOGLE
  // ==========================================

  const handleGoogleRegister = () => {
    console.log("Google OAuth");
  };

  // ==========================================
  // APPLE
  // ==========================================

  const handleAppleRegister = () => {
    console.log("Apple OAuth");
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}

          <AuthHeader
            title="Create your account."
            description="Join Gist and start connecting with people."
          />

          {/* FULL NAME */}

          <AuthInput
            placeholder="Full name"
            value={name}
            onChangeText={(value) => {
              setName(value);
              setError("");
            }}
            autoCapitalize="words"
          />

          {/* EMAIL */}

          <AuthInput
            placeholder="Email address"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* PASSWORD */}

          <View style={styles.passwordContainer}>
            <AuthInput
              placeholder="Password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setError("");
              }}
              secureTextEntry={!showPassword}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() =>
                setShowPassword(!showPassword)
              }
              hitSlop={10}
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={20}
                color={COLORS.textSecondary}
              />
            </Pressable>
          </View>

          {/* TERMS */}

          <Pressable
            style={styles.termsContainer}
            onPress={() => {
              setAgreedToTerms(!agreedToTerms);
              setError("");
            }}
          >
            <View
              style={[
                styles.checkbox,
                agreedToTerms &&
                  styles.checkboxActive,
              ]}
            >
              {agreedToTerms && (
                <Ionicons
                  name="checkmark"
                  size={15}
                  color={COLORS.black}
                />
              )}
            </View>

            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text style={styles.termsLink}>
                Terms and Conditions
              </Text>{" "}
              and{" "}
              <Text style={styles.termsLink}>
                Privacy Policy
              </Text>
            </Text>
          </Pressable>

          {/* ERROR */}

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}

          {/* CREATE ACCOUNT */}

          <AuthButton
            title="Create Account"
            onPress={handleRegister}
          />

          {/* DIVIDER */}

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />

            <Text style={styles.dividerText}>
              OR
            </Text>

            <View style={styles.divider} />
          </View>

          {/* GOOGLE */}

          <Pressable
            style={styles.socialButton}
            onPress={handleGoogleRegister}
          >
            <Ionicons
              name="logo-google"
              size={19}
              color={COLORS.text}
            />

            <Text style={styles.socialText}>
              Continue with Google
            </Text>
          </Pressable>

          {/* APPLE */}

          <Pressable
            style={styles.socialButton}
            onPress={handleAppleRegister}
          >
            <Ionicons
              name="logo-apple"
              size={20}
              color={COLORS.text}
            />

            <Text style={styles.socialText}>
              Continue with Apple
            </Text>
          </Pressable>

          {/* LOGIN */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate("Login")
              }
            >
              <Text style={styles.link}>
                Log in
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

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
    marginTop: 8,
    marginBottom: 14,
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

  error: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: -2,
    marginBottom: 8,
    textAlign: "center",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
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
    marginTop: 16,
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
