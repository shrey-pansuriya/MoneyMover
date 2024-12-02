import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { fetchUserLogin } from "../utils/database" // Import the function to fetch login details
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for storing token
import { authStore } from "../utils/authstore";  // Import the MobX auth store

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null);

  const [authPassword, setAuthPassword] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    // Pre-fill email from the MobX store or any stored user data
    if (authStore.isAuthenticated) {
      setAuthEmail(authStore.userEmail || "");  // Pre-fill email if user is authenticated already
    }

    return () => {
      setAuthPassword("");
      setAuthEmail("");
    };
  }, []);

  const error = isSubmitted ? validationError : "";

  async function login() {
    setIsSubmitted(true);
    setAttemptsCount(attemptsCount + 1);

    console.log("Login attempt with email:", authEmail);
    console.log("Password entered:", authPassword);

    // Fetch login details from the database for the entered email
    const user = await fetchUserLogin(authEmail);
    console.log("Fetched user data:", user);

    if (user && user.password === authPassword) {
      console.log("Login successful!");
      const token = String(Date.now()); // Mocking a successful login with a token

      // Save token to AsyncStorage and MobX store
      await authStore.login(token, authEmail);  // Use MobX store to update the state

      setIsSubmitted(false);
      setAuthPassword("");
      setAuthEmail("");
    } else {
      console.log("Invalid credentials or password mismatch.");
      setValidationError("Invalid email or password");
    }
  }

  async function logout() {
    // Clear token from AsyncStorage and reset MobX store
    await authStore.logout();
  }


  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" tx="loginScreen.logIn" preset="heading" style={$logIn} />
      <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails} />
      {attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />}

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen.passwordFieldLabel"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-button"
        tx="loginScreen.tapToLogIn"
        style={$tapButton}
        preset="reversed"
        onPress={login}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $logIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}
