import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import useAppStore from "../store/useAppStore";

// Main screens
import SplashScreen from "../screens/SplashScreen";
import GetStartedScreen from "../screens/GetStartedScreen";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";

// Auth screens
import RegisterScreen from "../screens/auth/RegisterScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import VerifyOTPScreen from "../screens/auth/VerifyOTPScreen";
import CreateNewPasswordScreen from "../screens/auth/CreateNewPasswordScreen";
import VerifyContactScreen from "../screens/auth/VerifyContactScreen";

// Profile screens
import CompleteProfile from "../screens/CompleteProfile";
import SelectInterestsScreen from "../screens/SelectInterestsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isHydrated = useAppStore((state) => state.isHydrated);

  /*
   * Zustand must finish restoring persisted state
   * before the navigation tree is created.
   */
  if (!isHydrated) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: false,
        }}
      >
        {/* STARTUP */}

        <Stack.Screen name="Splash" component={SplashScreen} />

        <Stack.Screen name="GetStarted" component={GetStartedScreen} />

        {/* AUTH */}

        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen name="VerifyContact" component={VerifyContactScreen} />

        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />

        <Stack.Screen
          name="CreateNewPassword"
          component={CreateNewPasswordScreen}
        />

        {/* PROFILE */}

        <Stack.Screen name="CompleteProfile" component={CompleteProfile} />

        <Stack.Screen
          name="SelectInterests"
          component={SelectInterestsScreen}
        />

        {/* APP */}

        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
