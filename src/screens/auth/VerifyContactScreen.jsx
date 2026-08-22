import { useState, useRef } from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import COLORS from "../../constants/colors";
import AuthButton from "../../components/auth/AuthButton";
import useAppStore from "../../store/useAppStore";

export default function VerifyContactScreen({ navigation, route }) {
  const {
    contact = "",
    method = "email",
    purpose = "registration",
  } = route.params || {};

  // ==================================================
  // STORE
  // ==================================================

  const setProfile = useAppStore((state) => state.setProfile);
  const updateProfile = useAppStore((state) => state.updateProfile);

  // ==================================================
  // STATE
  // ==================================================

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const inputs = useRef([]);

  const isEmail = method === "email";

  // ==================================================
  // OTP INPUT
  // ==================================================

  const handleChange = (value, index) => {
    const cleanedValue = value.replace(/\D/g, "");

    const newOtp = [...otp];

    // --------------------------------------------------
    // Handle pasted OTP
    // --------------------------------------------------

    if (cleanedValue.length > 1) {
      const digits = cleanedValue.slice(0, 6).split("");

      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || "";
      }

      setOtp(newOtp);
      setError("");

      const nextIndex = Math.min(digits.length, 5);

      inputs.current[nextIndex]?.focus();

      return;
    }

    // --------------------------------------------------
    // Normal single digit
    // --------------------------------------------------

    newOtp[index] = cleanedValue;

    setOtp(newOtp);
    setError("");

    if (cleanedValue && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // ==================================================
  // BACKSPACE
  // ==================================================

  const handleKeyPress = (event, index) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  // ==================================================
  // VERIFY
  // ==================================================

  const handleVerify = () => {
    const code = otp.join("");

    setError("");

    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    console.log("Verification:", {
      contact,
      method,
      purpose,
      code,
    });

    // ==================================================
    // REGISTRATION EMAIL VERIFICATION
    // ==================================================

    if (purpose === "registration") {
      /*
       * The registration data was already saved by
       * RegisterScreen.
       *
       * We only need to mark the email as verified.
       */

      updateProfile({
        email: contact,
        emailVerified: true,
        onboardingCompleted: false,
      });

      /*
       * Continue to profile completion.
       *
       * We intentionally do NOT pass the profile through
       * navigation params because the store now owns it.
       */

      navigation.replace("CompleteProfile");

      return;
    }

    // ==================================================
    // PHONE VERIFICATION
    // ==================================================

    if (purpose === "profilePhone") {
      /*
       * The phone number was entered on CompleteProfile.
       *
       * Update the dedicated profile state once the OTP
       * has been successfully verified.
       */

      updateProfile({
        phone: contact,
        phoneVerified: true,
      });

      /*
       * Continue directly to interests.
       */

      navigation.replace("SelectInterests");

      return;
    }

    // ==================================================
    // PASSWORD RESET
    // ==================================================

    if (purpose === "passwordReset") {
      navigation.replace("VerifyOTP", {
        contact,
        method,
        purpose: "passwordReset",
      });

      return;
    }

    // ==================================================
    // UNKNOWN PURPOSE
    // ==================================================

    console.warn(
      `Unknown verification purpose: ${purpose}`,
    );
  };

  // ==================================================
  // RESEND
  // ==================================================

  const handleResend = () => {
    console.log(
      `Resending verification code via ${
        isEmail ? "email" : "SMS"
      }`,
      contact,
    );

    setOtp(["", "", "", "", "", ""]);
    setError("");

    inputs.current[0]?.focus();
  };

  // ==================================================
  // CHANGE CONTACT
  // ==================================================

  const handleChangeContact = () => {
    navigation.goBack();
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
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
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>

          <View style={styles.form}>
            {/* HEADER */}

            <View style={styles.header}>
              <Text style={styles.title}>
                Verify your contact.
              </Text>

              <Text style={styles.description}>
                {isEmail
                  ? "We sent a 6-digit verification code to your email address."
                  : "We sent a 6-digit verification code by SMS to your phone number."}
              </Text>

              <Text style={styles.contact}>
                {contact}
              </Text>
            </View>

            {/* OTP */}

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputActive,
                    error && styles.otpInputError,
                  ]}
                  value={digit}
                  onChangeText={(value) =>
                    handleChange(value, index)
                  }
                  onKeyPress={(event) =>
                    handleKeyPress(event, index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  textContentType={
                    index === 0 ? "oneTimeCode" : "none"
                  }
                  autoComplete={
                    index === 0 ? "sms-otp" : "off"
                  }
                />
              ))}
            </View>

            {/* ERROR */}

            {error ? (
              <Text style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            {/* VERIFY */}

            <AuthButton
              title="Verify Code"
              onPress={handleVerify}
            />

            {/* RESEND */}

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Didn't receive the code?
              </Text>

              <Pressable
                onPress={handleResend}
                hitSlop={8}
              >
                <Text style={styles.resendLink}>
                  Resend
                </Text>
              </Pressable>
            </View>

            {/* CHANGE CONTACT */}

            <Pressable
              style={styles.changeButton}
              onPress={handleChangeContact}
              hitSlop={8}
            >
              <Text style={styles.changeText}>
                Use a different{" "}
                {isEmail ? "email" : "phone number"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ======================================================
// STYLES
// ======================================================

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
    paddingTop: 8,
    paddingBottom: 32,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  backArrow: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 34,
    marginTop: -3,
  },

  form: {
    flex: 1,
    justifyContent: "center",
    marginTop: 10,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
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
    maxWidth: 330,
    marginTop: 9,
  },

  contact: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  otpInput: {
    width: 46,
    height: 52,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  otpInputActive: {
    borderColor: COLORS.white,
  },

  otpInputError: {
    borderColor: "#ff5c5c",
  },

  errorText: {
    color: "#ff5c5c",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 12,
    marginTop: 4,
  },

  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  resendText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  resendLink: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 5,
  },

  changeButton: {
    alignItems: "center",
    marginTop: 18,
  },

  changeText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "500",
  },
});