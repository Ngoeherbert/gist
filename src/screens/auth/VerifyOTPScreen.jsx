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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import COLORS from "../../constants/colors";
import AuthButton from "../../components/auth/AuthButton";
import { useAppStore } from "../../store/useAppStore";

export default function VerifyOTP({ navigation, route }) {
  const {
    contact = "",
    method = "email",
    purpose = "registration",
  } = route?.params || {};

  const updateProfile = useAppStore(
    (state) => state.updateProfile
  );

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputs = useRef([]);

  const isEmail = method === "email";

  // ==================================================
  // OTP INPUT
  // ==================================================

  const handleChange = (value, index) => {
    // Keep numbers only.
    const cleanedValue = value.replace(/[^0-9]/g, "");

    const newOtp = [...otp];

    // --------------------------------------------------
    // COMPLETE OTP PASTE
    // --------------------------------------------------

    if (cleanedValue.length > 1) {
      const digits = cleanedValue
        .slice(0, 6)
        .split("");

      digits.forEach((digit, i) => {
        newOtp[i] = digit;
      });

      // Clear remaining boxes.
      for (let i = digits.length; i < 6; i++) {
        newOtp[i] = "";
      }

      setOtp(newOtp);
      setError("");

      const nextIndex = Math.min(
        digits.length,
        5
      );

      inputs.current[nextIndex]?.focus();

      return;
    }

    // --------------------------------------------------
    // SINGLE DIGIT
    // --------------------------------------------------

    newOtp[index] = cleanedValue;

    setOtp(newOtp);
    setError("");

    // Automatically move to next box.
    if (
      cleanedValue &&
      index < 5
    ) {
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
  // VERIFY OTP
  // ==================================================

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      setError(
        "Please enter the 6-digit verification code."
      );

      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      /*
       * ==================================================
       * BACKEND VERIFICATION
       * ==================================================
       *
       * Replace this section with your real API call.
       *
       * Example:
       *
       * const response = await verifyOTP({
       *   contact,
       *   method,
       *   code,
       * });
       *
       * if (!response.success) {
       *   throw new Error("Invalid verification code");
       * }
       */

      console.log("OTP verification:", {
        contact,
        method,
        purpose,
        code,
      });

      // ==================================================
      // EMAIL REGISTRATION
      // ==================================================

      if (
        purpose === "registration" &&
        isEmail
      ) {
        /*
         * The email has now been verified.
         *
         * Save this directly to Zustand.
         */
        updateProfile({
          email: contact.trim(),
          emailVerified: true,
        });

        /*
         * Go to CompleteProfile.
         *
         * CompleteProfile reads the profile
         * directly from Zustand.
         */
        navigation.replace("CompleteProfile");

        return;
      }

      // ==================================================
      // PHONE REGISTRATION
      // ==================================================

      if (
        purpose === "registration" &&
        !isEmail
      ) {
        /*
         * If registration ever uses phone
         * verification, save the phone as verified.
         */
        updateProfile({
          phone: contact.trim(),
          phoneVerified: true,
        });

        navigation.replace("CompleteProfile");

        return;
      }

      // ==================================================
      // PROFILE PHONE VERIFICATION
      // ==================================================

      if (purpose === "profilePhone") {
        /*
         * The phone entered on CompleteProfile
         * has now been verified.
         */
        updateProfile({
          phone: contact.trim(),
          phoneVerified: true,
        });

        /*
         * Do NOT return to CompleteProfile.
         *
         * Continue directly to interests.
         */
        navigation.replace("SelectInterests");

        return;
      }

      // ==================================================
      // PASSWORD RESET
      // ==================================================

      if (purpose === "passwordReset") {
        navigation.replace(
          "CreateNewPassword",
          {
            contact,
            method,
          }
        );

        return;
      }

      // ==================================================
      // FALLBACK
      // ==================================================

      console.warn(
        `VerifyOTP received unsupported purpose: ${purpose}`
      );

      navigation.goBack();
    } catch (verificationError) {
      console.log(
        "OTP verification error:",
        verificationError
      );

      setError(
        verificationError?.message ||
          "Invalid verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // RESEND
  // ==================================================

  const handleResend = () => {
    console.log(
      `Resending OTP via ${
        isEmail ? "email" : "SMS"
      }`,
      contact
    );

    setOtp([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    setError("");

    inputs.current[0]?.focus();

    /*
     * Replace this with your real resend API.
     *
     * Example:
     *
     * await resendOTP({
     *   contact,
     *   method,
     * });
     */
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
              size={21}
              color={COLORS.text}
            />
          </Pressable>

          <View style={styles.form}>
            {/* HEADER */}

            <View style={styles.header}>
              <Text style={styles.title}>
                {isEmail
                  ? "Verify your email."
                  : "Verify your phone."}
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
                    digit &&
                      styles.otpInputActive,
                    error &&
                      styles.otpInputError,
                  ]}
                  value={digit}
                  onChangeText={(value) =>
                    handleChange(
                      value,
                      index
                    )
                  }
                  onKeyPress={(event) =>
                    handleKeyPress(
                      event,
                      index
                    )
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  textContentType="oneTimeCode"
                  autoComplete="sms-otp"
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
              title={
                loading
                  ? "Verifying..."
                  : "Verify Code"
              }
              onPress={handleVerify}
              disabled={loading}
            />

            {/* RESEND */}

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Didn't receive the code?
              </Text>

              <Pressable
                onPress={handleResend}
                hitSlop={8}
                disabled={loading}
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
              disabled={loading}
            >
              <Text style={styles.changeText}>
                Use a different{" "}
                {isEmail
                  ? "email"
                  : "phone number"}
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