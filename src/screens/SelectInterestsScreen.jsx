import { useMemo, useState } from "react";
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

import COLORS from "../constants/colors";
import AuthButton from "../components/auth/AuthButton";

import useAppStore from "../store/useAppStore";

const INTERESTS = [
  {
    id: "music",
    label: "Music",
    icon: "musical-notes-outline",
  },
  {
    id: "movies",
    label: "Movies",
    icon: "film-outline",
  },
  {
    id: "sports",
    label: "Sports",
    icon: "football-outline",
  },
  {
    id: "gaming",
    label: "Gaming",
    icon: "game-controller-outline",
  },
  {
    id: "technology",
    label: "Technology",
    icon: "laptop-outline",
  },
  {
    id: "fashion",
    label: "Fashion",
    icon: "shirt-outline",
  },
  {
    id: "travel",
    label: "Travel",
    icon: "airplane-outline",
  },
  {
    id: "food",
    label: "Food",
    icon: "restaurant-outline",
  },
  {
    id: "fitness",
    label: "Fitness",
    icon: "fitness-outline",
  },
  {
    id: "art",
    label: "Art",
    icon: "color-palette-outline",
  },
  {
    id: "books",
    label: "Books",
    icon: "book-outline",
  },
  {
    id: "business",
    label: "Business",
    icon: "briefcase-outline",
  },
  {
    id: "photography",
    label: "Photography",
    icon: "camera-outline",
  },
  {
    id: "nature",
    label: "Nature",
    icon: "leaf-outline",
  },
  {
    id: "education",
    label: "Education",
    icon: "school-outline",
  },
  {
    id: "social",
    label: "Social",
    icon: "people-outline",
  },
];

const MIN_INTERESTS = 3;

export default function SelectInterests({ navigation }) {
  // ==================================================
  // ZUSTAND
  // ==================================================

  const profile = useAppStore((state) => state.profile);

  const updateProfile = useAppStore(
    (state) => state.updateProfile,
  );

  // ==================================================
  // INITIAL INTERESTS
  // ==================================================

  const storedInterests = Array.isArray(profile?.interests)
    ? profile.interests
    : [];

  const [selectedInterests, setSelectedInterests] =
    useState(storedInterests);

  // ==================================================
  // TOGGLE INTEREST
  // ==================================================

  const toggleInterest = (id) => {
    setSelectedInterests((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  };

  // ==================================================
  // VALIDATION
  // ==================================================

  const canContinue =
    selectedInterests.length >= MIN_INTERESTS;

  const selectedCountText = useMemo(() => {
    if (selectedInterests.length === 0) {
      return `Choose at least ${MIN_INTERESTS}`;
    }

    if (selectedInterests.length < MIN_INTERESTS) {
      const remaining =
        MIN_INTERESTS - selectedInterests.length;

      return `Choose ${remaining} more`;
    }

    return `${selectedInterests.length} selected`;
  }, [selectedInterests.length]);

  // ==================================================
  // FINISH ONBOARDING
  // ==================================================

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    const updates = {
      interests: selectedInterests,
      onboardingCompleted: true,
    };

    // Save directly to Zustand.
    updateProfile(updates);

    console.log("Onboarding completed:", {
      ...profile,
      ...updates,
    });

    // Home reads the profile from Zustand.
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Home",
        },
      ],
    });
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
          {/* TOP BAR */}

          <View style={styles.topBar}>
            <View style={styles.topBarSpacer} />

            <Text style={styles.stepText}>
              Almost done
            </Text>
          </View>

          {/* HEADER */}

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="sparkles-outline"
                size={25}
                color={COLORS.text}
              />
            </View>

            <Text style={styles.title}>
              What are you into?
            </Text>

            <Text style={styles.description}>
              Choose a few interests to personalize
              your experience and help you discover
              people and content you'll enjoy.
            </Text>
          </View>

          {/* COUNTER */}

          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {selectedCountText}
            </Text>

            <Text style={styles.counterNumber}>
              {selectedInterests.length}/{INTERESTS.length}
            </Text>
          </View>

          {/* INTERESTS */}

          <View style={styles.interestsContainer}>
            {INTERESTS.map((interest) => {
              const selected =
                selectedInterests.includes(
                  interest.id,
                );

              return (
                <Pressable
                  key={interest.id}
                  style={[
                    styles.interest,
                    selected &&
                      styles.interestSelected,
                  ]}
                  onPress={() =>
                    toggleInterest(interest.id)
                  }
                >
                  <View
                    style={[
                      styles.interestIcon,
                      selected &&
                        styles.interestIconSelected,
                    ]}
                  >
                    <Ionicons
                      name={interest.icon}
                      size={18}
                      color={
                        selected
                          ? COLORS.black
                          : COLORS.text
                      }
                    />
                  </View>

                  <Text
                    style={[
                      styles.interestText,
                      selected &&
                        styles.interestTextSelected,
                    ]}
                  >
                    {interest.label}
                  </Text>

                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={17}
                      color={COLORS.black}
                      style={styles.checkIcon}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* CONTINUE */}

          <View style={styles.buttonContainer}>
            <AuthButton
              title="Continue"
              onPress={handleContinue}
              disabled={!canContinue}
            />
          </View>

          <Text style={styles.footerText}>
            You can change your interests later.
          </Text>
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

  topBar: {
    width: "100%",
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  topBarSpacer: {
    flex: 1,
  },

  stepText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },

  header: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 24,
  },

  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
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
    maxWidth: 340,
    marginTop: 9,
  },

  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  counterText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  counterNumber: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },

  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  interest: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
  },

  interestSelected: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },

  interestIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  interestIconSelected: {
    backgroundColor: COLORS.black,
  },

  interestText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },

  interestTextSelected: {
    color: COLORS.black,
  },

  checkIcon: {
    marginLeft: 7,
  },

  buttonContainer: {
    marginTop: 28,
  },

  footerText: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 14,
    lineHeight: 17,
  },
});