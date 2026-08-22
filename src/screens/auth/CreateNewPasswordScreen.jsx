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

import useAuthStore from "../../store/useAuthStore";

export default function CreateNewPasswordScreen({
  navigation,
  route,
}) {
  const {
    contact = "",
    method = "email",
  } = route?.params || {};

  // ==================================================
  // ZUSTAND
  // ==================================================

  const user = useAuthStore((state) => state.user);

  /*
   * We don't change authentication state here yet.
   *
   * The actual password update should eventually be
   * handled by your backend/authentication service.
   *
   * We keep useAuthStore connected so this screen belongs
   * to the same authentication state system.
   */

  // ==================================================
  // STATE
  // ==================================================

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  // ==================================================
  // PASSWORD VALIDATION
  // ==================================================

  const validatePassword = () => {
    if (!password.trim()) {
      return "Please enter a new password.";
    }

    if (password.length < 8) {
      return "Your password must be at least 8 characters long.";
    }

    if (!confirmPassword.trim()) {
      return "Please confirm your new password.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  // ==================================================
  // RESET PASSWORD
  // ==================================================

  const handleResetPassword = () => {
    const validationError = validatePassword();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    /*
     * Backend password reset will be connected here.
     *
     * For now we simply confirm that the reset flow
     * reached this point successfully.
     */

    console.log("Password reset:", {
      contact,
      method,
      user,
    });

    console.log("Password successfully changed");

    /*
     * Password reset is complete.
     *
     * Replace instead of navigate so the user cannot
     * return to CreateNewPassword with the back button.
     */

    navigation.replace("Login");
  };

  // ==================================================
  // PASSWORD CHANGE
  // ==================================================

  const handlePasswordChange = (value) => {
    setPassword(value);

    if (error) {
      setError("");
    }
  };

  // ==================================================
  // CONFIRM PASSWORD CHANGE
  // ==================================================

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);

    if (error) {
      setError("");
    }
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
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
          title="Create new password."
          description="Choose a strong password that you haven't used before."
        />

        {/* PASSWORD */}

        <View style={styles.passwordContainer}>
          <AuthInput
            placeholder="New password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
          />

          <Pressable
            style={styles.eyeButton}
            onPress={() =>
              setShowPassword((current) => !current)
            }
            hitSlop={8}
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

        {/* CONFIRM PASSWORD */}

        <View style={styles.passwordContainer}>
          <AuthInput
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={
              handleConfirmPasswordChange
            }
            secureTextEntry={!showConfirmPassword}
          />

          <Pressable
            style={styles.eyeButton}
            onPress={() =>
              setShowConfirmPassword(
                (current) => !current,
              )
            }
            hitSlop={8}
          >
            <Ionicons
              name={
                showConfirmPassword
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={20}
              color={COLORS.textSecondary}
            />
          </Pressable>
        </View>

        {/* ERROR */}

        {error ? (
          <Text style={styles.errorText}>
            {error}
          </Text>
        ) : null}

        {/* RESET */}

        <AuthButton
          title="Reset Password"
          onPress={handleResetPassword}
        />

        {/* INFO */}

        <Text style={styles.info}>
          Your password should be at least 8
          characters long.
        </Text>
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

  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: -6,
    marginBottom: 10,
    paddingHorizontal: 4,
  },

  info: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 16,
  },
});
