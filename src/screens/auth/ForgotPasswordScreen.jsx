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

export default function ForgotPasswordScreen({ navigation }) {
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");

  /*
   * ==================================================
   * ZUSTAND
   * ==================================================
   *
   * We use the auth store here because this screen
   * belongs to the authentication/password-reset flow.
   *
   * No profile data is modified on this screen.
   */

  const user = useAuthStore((state) => state.user);

  // --------------------------------------------------
  // VALIDATE CONTACT
  // --------------------------------------------------

  const validateContact = (value) => {
    const input = value.trim();

    if (!input) {
      return {
        valid: false,
        message: "Please enter your email or phone number.",
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Phone validation
    const phoneRegex = /^\+?[0-9\s()-]{7,}$/;

    if (emailRegex.test(input)) {
      return {
        valid: true,
        method: "email",
      };
    }

    const digitsOnly = input.replace(/\D/g, "");

    if (phoneRegex.test(input) && digitsOnly.length >= 7) {
      return {
        valid: true,
        method: "phone",
      };
    }

    return {
      valid: false,
      message: "Enter a valid email address or phone number.",
    };
  };

  // --------------------------------------------------
  // CONTINUE
  // --------------------------------------------------

  const handleContinue = () => {
    const result = validateContact(contact);

    if (!result.valid) {
      setError(result.message);
      return;
    }

    setError("");

    const normalizedContact = contact.trim();

    /*
     * The auth store can already contain the currently
     * authenticated/known user. We don't overwrite it
     * here because password reset is allowed to start
     * with an email or phone that isn't currently loaded.
     */

    console.log("Password reset requested:", {
      contact: normalizedContact,
      method: result.method,
      user,
    });

    navigation.navigate("VerifyOTP", {
      contact: normalizedContact,
      method: result.method,
      purpose: "passwordReset",
    });
  };

  // --------------------------------------------------
  // CONTACT CHANGE
  // --------------------------------------------------

  const handleContactChange = (value) => {
    setContact(value);

    if (error) {
      setError("");
    }
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

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
          {/* BACK BUTTON */}

          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={10}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={COLORS.text}
            />
          </Pressable>

          {/* FORM */}

          <View style={styles.form}>
            <AuthHeader
              title="Find your account."
              description="Enter your email or mobile number and we'll help you reset your password."
            />

            <AuthInput
              placeholder="Email or phone number"
              value={contact}
              onChangeText={handleContactChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {error ? (
              <Text style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            <AuthButton
              title="Continue"
              onPress={handleContinue}
            />
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  form: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },

  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: -6,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
});
