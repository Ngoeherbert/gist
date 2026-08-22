import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialProfile = {
  name: "",
  username: "",

  email: "",
  emailVerified: false,

  phone: "",
  countryCode: "+237",
  phoneVerified: false,

  bio: "",
  gender: "",
  birthday: "",

  location: "",
  coordinates: null,

  interests: [],

  onboardingCompleted: false,
};

const useAuthStore = create(
  persist(
    (set) => ({
      // ==========================================
      // AUTH STATE
      // ==========================================

      isAuthenticated: false,

      user: null,

      // ==========================================
      // PROFILE
      // ==========================================

      profile: initialProfile,

      // ==========================================
      // AUTH ACTIONS
      // ==========================================

      setAuthenticated: (value) =>
        set({
          isAuthenticated: value,
        }),

      setUser: (user) =>
        set({
          user,
        }),

      // ==========================================
      // PROFILE ACTIONS
      // ==========================================

      setProfile: (profile) =>
        set({
          profile: {
            ...initialProfile,
            ...profile,
          },
        }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
          },
        })),

      // ==========================================
      // ONBOARDING
      // ==========================================

      setOnboardingCompleted: (value) =>
        set((state) => ({
          profile: {
            ...state.profile,
            onboardingCompleted: value,
          },
        })),

      // ==========================================
      // LOGOUT
      // ==========================================

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          profile: initialProfile,
        }),

      // ==========================================
      // RESET AUTH STATE
      // ==========================================

      resetAuth: () =>
        set({
          isAuthenticated: false,
          user: null,
          profile: initialProfile,
        }),
    }),
    {
      name: "gist-auth-storage",

      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        profile: state.profile,
      }),
    },
  ),
);

export default useAuthStore;
