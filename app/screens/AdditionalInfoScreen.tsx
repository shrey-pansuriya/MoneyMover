// AdditionalInfoScreen.tsx

import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { AppStackParamList } from "../navigators/AppNavigator" 
import { insertUserInfo } from "d:/ReactNative/MoneyMover/app/utils/database";

interface AdditionalInfoScreenProps extends AppStackScreenProps<"AdditionalInfo"> {}

export const AdditionalInfoScreen: FC<AdditionalInfoScreenProps> = observer(function AdditionalInfoScreen(_props) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [age, setAge] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const validateInput = () => {
    // Reset the error message
    setErrorMessage("");

    // Check for empty fields
    if (!firstName || !lastName || !age || !address || !phone) {
      setErrorMessage("All fields are required.");
      return false;
    }

    // Validate age: should be a non-zero integer
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum <= 0) {
      setErrorMessage("Age must be a non-zero integer.");
      return false;
    }

    // Validate phone: should be a valid phone number format (example for a 10-digit phone number)
    const phoneRegex = /^[0-9]{10}$/; // Adjust this regex according to your needs
    if (!phoneRegex.test(phone)) {
      setErrorMessage("Phone number must be a valid 10-digit number.");
      return false;
    }

    return true; // Return true if all validations pass
  }

  const handleSubmit = () => {
    setIsSubmitted(true)

    // Validate inputs before submitting
    if (!validateInput()) {
        return; // Exit if validation fails
      }

    // Handle submission logic, e.g., validation or saving data to state/store
    if (!firstName || !lastName || !age || !address || !phone) {
      // Display an error message or handle the error
      return
    }
    
    // Insert the user info into the SQLite database
    insertUserInfo(firstName, lastName, parseInt(age), address, phone);

    // Mock submission - you can replace this with actual API call or state update
    console.log({ firstName, lastName, age, address, phone })

    // Navigate to the Welcome screen after successful submission
    _props.navigation.navigate("Welcome")
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="additional-info-heading" tx="additionalInfoScreen.title" preset="heading" style={$heading} />
      <Text tx="additionalInfoScreen.subtitle" preset="subheading" style={$subheading} />

      <TextField
        value={firstName}
        onChangeText={setFirstName}
        containerStyle={$textField}
        labelTx="additionalInfoScreen.firstNameFieldLabel"
        placeholderTx="additionalInfoScreen.firstNameFieldPlaceholder"
      />

      <TextField
        value={lastName}
        onChangeText={setLastName}
        containerStyle={$textField}
        labelTx="additionalInfoScreen.lastNameFieldLabel"
        placeholderTx="additionalInfoScreen.lastNameFieldPlaceholder"
      />

      <TextField
        value={age}
        onChangeText={setAge}
        containerStyle={$textField}
        labelTx="additionalInfoScreen.ageFieldLabel"
        placeholderTx="additionalInfoScreen.ageFieldPlaceholder"
        keyboardType="numeric"
      />

      <TextField
        value={address}
        onChangeText={setAddress}
        containerStyle={$textField}
        labelTx="additionalInfoScreen.addressFieldLabel"
        placeholderTx="additionalInfoScreen.addressFieldPlaceholder"
      />

      <TextField
        value={phone}
        onChangeText={setPhone}
        containerStyle={$textField}
        labelTx="additionalInfoScreen.phoneFieldLabel"
        placeholderTx="additionalInfoScreen.phoneFieldPlaceholder"
        keyboardType="phone-pad"
      />

      <Button
        testID="additional-info-submit-button"
        tx="additionalInfoScreen.submitButton"
        style={$submitButton}
        onPress={handleSubmit}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $heading: TextStyle = {
  marginBottom: spacing.sm,
}

const $subheading: TextStyle = {
  marginBottom: spacing.lg,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $submitButton: ViewStyle = {
  marginTop: spacing.xs,
}
