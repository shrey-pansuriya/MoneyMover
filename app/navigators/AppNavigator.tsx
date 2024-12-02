import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import * as Screens from "app/screens";
import Config from "../config";
import { DemoNavigator, DemoTabParamList } from "./DemoNavigator";
import { navigationRef, useBackButtonHandler } from "./navigationUtilities";
import { colors } from "app/theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStore } from "../utils/authstore";  // Import the MobX auth store

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 */
export type AppStackParamList = {
  Welcome: undefined;
  Login: undefined;
  AdditionalInfo: undefined;
  Demo: NavigatorScreenParams<DemoTabParamList>;
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>;

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = observer(function AppStack() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // To handle the auth token check

  // Check auth token using MobX store
  useEffect(() => {
    const checkAuth = async () => {
      await authStore.checkAuthToken();  // This will check the token and update the state
      setIsCheckingAuth(false); // Stop checking once the token check is complete
    };

    checkAuth(); // Initiate the check
  }, []);

  if (isCheckingAuth) {
    return null;  // Show a loading screen while checking for the token
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
      initialRouteName={authStore.isAuthenticated ? "Welcome" : "Login"} // Use authStore to determine initial route
    >
      {authStore.isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
          <Stack.Screen name="Demo" component={DemoNavigator} />
        </>
      ) : (
        <Stack.Screen name="Login" component={Screens.LoginScreen} />
      )}
    </Stack.Navigator>
  );
});

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme();

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName));

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  );
});

