import { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";

import COLORS from "../constants/colors";
import { images } from "../../assets/assets";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import PhoneInput from "../components/auth/PhoneInput";

import useProfileStore from "../store/useProfileStore";

export default function CompleteProfile({ navigation }) {
  // ==================================================
  // PROFILE STORE
  // ==================================================

  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  // ==================================================
  // STORED PROFILE
  // ==================================================

  const {
    name: storedName = "",
    username: storedUsername = "",
    email = "",
    emailVerified = false,

    phone: storedPhone = "",
    countryCode: storedCountryCode = "+237",

    bio: storedBio = "",
    gender: storedGender = "",
    birthday: storedBirthday = "",

    location: storedLocation = "",
    coordinates: storedCoordinates = null,
  } = profile || {};

  // ==================================================
  // LOCAL FORM STATE
  // ==================================================

  const [name, setName] = useState(storedName);
  const [username, setUsername] = useState(storedUsername);
  const [bio, setBio] = useState(storedBio);

  const [phone, setPhone] = useState(storedPhone);
  const [countryCode, setCountryCode] = useState(storedCountryCode || "+237");

  const [gender, setGender] = useState(storedGender);
  const [birthday, setBirthday] = useState(storedBirthday);

  const [location, setLocation] = useState(storedLocation);

  const [coordinates, setCoordinates] = useState(storedCoordinates);

  // ==================================================
  // MODALS
  // ==================================================

  const [showGenderModal, setShowGenderModal] = useState(false);

  const [showBirthdayModal, setShowBirthdayModal] = useState(false);

  // ==================================================
  // BIRTHDAY
  // ==================================================

  const [birthdayDate, setBirthdayDate] = useState(
    storedBirthday ? new Date(storedBirthday) : new Date(2000, 0, 1),
  );

  // ==================================================
  // LOCATION
  // ==================================================

  const [loadingLocation, setLoadingLocation] = useState(false);

  // ==================================================
  // OPTIONS
  // ==================================================

  const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];

  // ==================================================
  // BUILD PROFILE
  // ==================================================

  const buildProfileData = () => ({
    name: name.trim(),
    username: username.trim(),
    bio: bio.trim(),

    phone: phone.trim(),
    countryCode,

    gender,
    birthday,

    location,
    coordinates,

    email,
    emailVerified,
  });

  // ==================================================
  // CONTINUE
  // ==================================================

  const handleContinue = () => {
    const profileData = buildProfileData();

    // Save profile before navigating.
    updateProfile(profileData);

    /*
     * If a phone number was provided,
     * verify it before continuing.
     */
    if (phone.trim()) {
      navigation.navigate("VerifyContact", {
        contact: `${countryCode}${phone.trim()}`,
        method: "phone",
        purpose: "profilePhone",
      });

      return;
    }

    /*
     * No phone verification required.
     */
    navigation.navigate("SelectInterests");
  };

  // ==================================================
  // SKIP
  // ==================================================

  const handleSkip = () => {
    updateProfile(buildProfileData());

    navigation.navigate("SelectInterests");
  };

  // ==================================================
  // PROFILE PHOTO
  // ==================================================

  const handleChoosePhoto = () => {
    console.log("Choose profile photo");
  };

  // ==================================================
  // BIRTHDAY
  // ==================================================

  const formatBirthday = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBirthday = () => {
    setShowBirthdayModal(true);
  };

  const handleBirthdayChange = (event, selectedDate) => {
    if (event?.type === "dismissed") {
      if (Platform.OS === "android") {
        setShowBirthdayModal(false);
      }

      return;
    }

    if (!selectedDate) {
      return;
    }

    setBirthdayDate(selectedDate);
    setBirthday(formatBirthday(selectedDate));

    if (Platform.OS === "android") {
      setShowBirthdayModal(false);
    }
  };

  const handleBirthdayDone = () => {
    setBirthday(formatBirthday(birthdayDate));
    setShowBirthdayModal(false);
  };

  // ==================================================
  // LOCATION
  // ==================================================

  const handleLocation = async () => {
    if (loadingLocation) {
      return;
    }

    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location permission required",
          "Please allow location access to use your current GPS location.",
        );

        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude, accuracy } = currentLocation.coords;

      const gpsCoordinates = {
        latitude,
        longitude,
        accuracy: accuracy ?? null,
      };

      setCoordinates(gpsCoordinates);

      updateProfile({
        coordinates: gpsCoordinates,
      });

      // ==================================================
      // REVERSE GEOCODE
      // ==================================================

      try {
        const address = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (address.length > 0) {
          const place = address[0];

          const readableLocation = [place.city, place.region, place.country]
            .filter(Boolean)
            .join(", ");

          const readable =
            readableLocation ||
            `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

          setLocation(readable);

          updateProfile({
            location: readable,
          });
        } else {
          const readable = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

          setLocation(readable);

          updateProfile({
            location: readable,
          });
        }
      } catch (geocodeError) {
        console.log("Reverse geocoding error:", geocodeError);

        const readable = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

        setLocation(readable);

        updateProfile({
          location: readable,
        });
      }
    } catch (error) {
      console.log("Location error:", error);

      Alert.alert(
        "Unable to get location",
        "We couldn't determine your current location. Please try again.",
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* TOP BAR */}

          <View style={styles.topBar}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={10}
            >
              <Ionicons name="arrow-back" size={21} color={COLORS.text} />
            </Pressable>

            <Pressable onPress={handleSkip} hitSlop={10}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            {/* HEADER */}

            <View style={styles.header}>
              <Text style={styles.title}>Complete your profile.</Text>

              <Text style={styles.description}>
                Add a few details so people can recognize and connect with you.
              </Text>
            </View>

            {/* PROFILE PHOTO */}

            <View style={styles.photoSection}>
              <View style={styles.avatarContainer}>
                <Image
                  source={images.logo}
                  style={styles.avatar}
                  resizeMode="contain"
                />

                <Pressable
                  style={styles.cameraButton}
                  onPress={handleChoosePhoto}
                  hitSlop={6}
                >
                  <Ionicons name="camera" size={15} color={COLORS.black} />
                </Pressable>
              </View>

              <Pressable onPress={handleChoosePhoto}>
                <Text style={styles.photoText}>Add profile photo</Text>
              </Pressable>
            </View>

            {/* NAME */}

            <AuthInput
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            {/* USERNAME */}

            <AuthInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* PHONE */}

            <View style={styles.phoneSection}>
              <View style={styles.phoneLabelRow}>
                <Text style={styles.fieldLabel}>Phone number</Text>

                <Text style={styles.optionalLabel}>Optional</Text>
              </View>

              <PhoneInput
                value={phone}
                onChangeText={setPhone}
                onCountryChange={(country) => setCountryCode(country.dialCode)}
              />

              {phone.trim() ? (
                <View style={styles.phoneHint}>
                  <Ionicons
                    name="information-circle-outline"
                    size={15}
                    color={COLORS.textMuted}
                  />

                  <Text style={styles.phoneHintText}>
                    We'll send a verification code by SMS.
                  </Text>
                </View>
              ) : null}
            </View>

            {/* GENDER */}

            <View style={styles.fieldSection}>
              <View style={styles.labelRow}>
                <Text style={styles.fieldLabel}>Gender</Text>

                <Text style={styles.optionalLabel}>Optional</Text>
              </View>

              <Pressable
                style={styles.selectInput}
                onPress={() => setShowGenderModal(true)}
              >
                <Text
                  style={[styles.selectText, !gender && styles.placeholderText]}
                >
                  {gender || "Select gender"}
                </Text>

                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={COLORS.textMuted}
                />
              </Pressable>
            </View>

            {/* BIO */}

            <View style={styles.bioContainer}>
              <View style={styles.bioHeader}>
                <Text style={styles.bioLabel}>Bio</Text>

                <Text
                  style={[
                    styles.bioCount,
                    bio.length >= 150 && styles.bioCountLimit,
                  ]}
                >
                  {bio.length}/150
                </Text>
              </View>

              <View style={styles.bioInputWrapper}>
                <TextInput
                  placeholder="Tell people about yourself..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={bio}
                  onChangeText={(value) => setBio(value.slice(0, 150))}
                  multiline
                  maxLength={150}
                  style={styles.bioInput}
                />
              </View>
            </View>

            {/* MORE ABOUT YOU */}

            <View style={styles.optionalSection}>
              <View style={styles.optionalHeader}>
                <Text style={styles.sectionTitle}>More about you</Text>

                <Text style={styles.optionalText}>Optional</Text>
              </View>

              {/* LOCATION */}

              <Pressable
                style={styles.optionRow}
                onPress={handleLocation}
                disabled={loadingLocation}
              >
                <View style={styles.optionIcon}>
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={COLORS.text}
                  />
                </View>

                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Location</Text>

                  <Text style={styles.optionSubtitle}>
                    {loadingLocation
                      ? "Getting your exact location..."
                      : location || "Use your current GPS location"}
                  </Text>

                  {coordinates ? (
                    <Text style={styles.coordinatesText}>
                      GPS: {coordinates.latitude.toFixed(6)},{" "}
                      {coordinates.longitude.toFixed(6)}
                    </Text>
                  ) : null}
                </View>

                <Ionicons
                  name={loadingLocation ? "locate-outline" : "chevron-forward"}
                  size={18}
                  color={COLORS.textMuted}
                />
              </Pressable>

              {/* BIRTHDAY */}

              <Pressable style={styles.optionRow} onPress={handleBirthday}>
                <View style={styles.optionIcon}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={COLORS.text}
                  />
                </View>

                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Birthday</Text>

                  <Text style={styles.optionSubtitle}>
                    {birthday || "Add your birthday"}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.textMuted}
                />
              </Pressable>
            </View>

            {/* CONTINUE */}

            <AuthButton title="Continue" onPress={handleContinue} />

            <Text style={styles.footerHint}>
              You can update your profile information later.
            </Text>
          </View>
        </ScrollView>

        {/* ==================================================
            GENDER MODAL
        ================================================== */}

        <Modal
          visible={showGenderModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowGenderModal(false)}
          >
            <Pressable
              style={styles.genderModal}
              onPress={(event) => event.stopPropagation()}
            >
              <View style={styles.modalHandle} />

              <Text style={styles.modalTitle}>Select gender</Text>

              {genders.map((item) => (
                <Pressable
                  key={item}
                  style={styles.genderOption}
                  onPress={() => {
                    setGender(item);
                    setShowGenderModal(false);
                  }}
                >
                  <Text style={styles.genderText}>{item}</Text>

                  {gender === item ? (
                    <Ionicons name="checkmark" size={20} color={COLORS.text} />
                  ) : null}
                </Pressable>
              ))}
            </Pressable>
          </Pressable>
        </Modal>

        {/* ==================================================
            BIRTHDAY MODAL
        ================================================== */}

        <Modal
          visible={showBirthdayModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowBirthdayModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowBirthdayModal(false)}
          >
            <Pressable
              style={styles.birthdayModal}
              onPress={(event) => event.stopPropagation()}
            >
              <View style={styles.modalHandle} />

              <Text style={styles.modalTitle}>Select your birthday</Text>

              <Text style={styles.modalDescription}>
                Your birthday will be used to personalize your experience.
              </Text>

              <DateTimePicker
                value={birthdayDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "calendar"}
                maximumDate={new Date()}
                onChange={handleBirthdayChange}
                themeVariant="dark"
                style={styles.datePicker}
              />

              {Platform.OS === "ios" ? (
                <Pressable
                  style={styles.doneButton}
                  onPress={handleBirthdayDone}
                >
                  <Text style={styles.doneText}>Done</Text>
                </Pressable>
              ) : null}
            </Pressable>
          </Pressable>
        </Modal>
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

  topBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  skipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },

  form: {
    width: "100%",
    marginTop: 22,
  },

  header: {
    alignItems: "center",
    marginBottom: 26,
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
    marginTop: 8,
  },

  photoSection: {
    alignItems: "center",
    marginBottom: 26,
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cameraButton: {
    position: "absolute",
    right: -2,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.background,
  },

  photoText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },

  phoneSection: {
    marginTop: -2,
    marginBottom: 12,
  },

  phoneLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  fieldLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
  },

  optionalLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginBottom: 7,
  },

  phoneHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -7,
    marginBottom: 10,
  },

  phoneHintText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginLeft: 5,
  },

  fieldSection: {
    marginBottom: 16,
  },

  selectInput: {
    height: 52,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectText: {
    color: COLORS.text,
    fontSize: 14,
  },

  placeholderText: {
    color: COLORS.textSecondary,
  },

  bioContainer: {
    marginTop: 2,
    marginBottom: 18,
  },

  bioHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  bioLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },

  bioCount: {
    color: COLORS.textMuted,
    fontSize: 11,
  },

  bioCountLimit: {
    color: COLORS.text,
  },

  bioInputWrapper: {
    minHeight: 100,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
  },

  bioInput: {
    minHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: COLORS.text,
    fontSize: 14,
    textAlignVertical: "top",
  },

  optionalSection: {
    marginTop: 2,
    marginBottom: 20,
  },

  optionalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },

  optionalText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },

  optionRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  optionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },

  optionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },

  coordinatesText: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 3,
  },

  footerHint: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 14,
    lineHeight: 17,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },

  genderModal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },

  birthdayModal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    alignItems: "center",
  },

  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: 18,
  },

  modalTitle: {
    width: "100%",
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 7,
  },

  modalDescription: {
    width: "100%",
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },

  genderOption: {
    minHeight: 54,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  genderText: {
    color: COLORS.text,
    fontSize: 15,
  },

  datePicker: {
    width: "100%",
    height: 190,
  },

  doneButton: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  doneText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: "700",
  },
});
