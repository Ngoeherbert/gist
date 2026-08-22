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

const useAppStore = create(
  persist(
    (set) => ({
      // ==========================================
      // APP
      // ==========================================

      isHydrated: false,

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
      // HYDRATION
      // ==========================================

      setHydrated: () =>
        set({
          isHydrated: true,
        }),

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
      // RESET
      // ==========================================

      resetApp: () =>
        set({
          isAuthenticated: false,
          user: null,
          profile: initialProfile,
        }),
    }),

    {
      name: "fakoverse-storage",

      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        profile: state.profile,
      }),

      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.log("App store hydration error:", error);
            return;
          }

          state?.setHydrated();
        };
      },
    },
  ),
);

export default useAppStore;
