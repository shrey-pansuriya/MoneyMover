import React, { FC, useState } from "react"
import * as Application from "expo-application"
import { Modal, View, ViewStyle, TextStyle, TouchableOpacity, TextInput } from "react-native"
import { Button, ListItem, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { isRTL } from "../i18n"
import { useStores } from "../models"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authStore } from "../utils/authstore";  // Import the MobX auth store
/**
 * Component to display contact information modal.
 */
const ContactInfoModal: FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => (
  <Modal
    transparent={true}
    visible={visible}
    animationType="slide"
  >
    <View style={modalStyles.container}>
      <View style={modalStyles.innerContainer}>
        <Text style={modalStyles.title}>Contact Us</Text>
        <Text style={modalStyles.info}>
          Company Address: 123 Main St, Springfield, USA{"\n"}
          Helpline Number: +1 234 567 890{"\n"}
          Customer Support Email: support@example.com
        </Text>
        <TouchableOpacity style={modalStyles.button} onPress={onClose}>
          <Text style={modalStyles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

/**
 * Component for editing the user's profile information.
 */
const ChangeProfileInfoModal: FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [age, setAge] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")

  const handleSaveChanges = () => {
    // You can call the insertUserInfo or updateUserInfo function here to save the changes
    console.log("Saving changes:", { firstName, lastName, age, address, phone })
    onClose() // Close modal after saving
  }

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={modalStyles.container}>
        <View style={modalStyles.innerContainer}>
          <Text style={modalStyles.title}>Change Profile Info</Text>
          <TextInput
            style={modalStyles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
          />
          <TextInput
            style={modalStyles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
          />
          <TextInput
            style={modalStyles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Age"
            keyboardType="numeric"
          />
          <TextInput
            style={modalStyles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
          />
          <TextInput
            style={modalStyles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone"
            keyboardType="phone-pad"
          />
          <Button style={modalStyles.button} onPress={handleSaveChanges}>
            <Text style={modalStyles.buttonText}>Save Changes</Text>
          </Button>
          <Button style={modalStyles.button} onPress={onClose}>
            <Text style={modalStyles.buttonText}>Cancel</Text>
          </Button>
        </View>
      </View>
    </Modal>
  )
};

export const DemoDebugScreen: FC<DemoTabScreenProps<"Settings">> = function DemoDebugScreen(
  _props,
) {

  const logout = async () => {
    console.log('Logging out...');
    await AsyncStorage.removeItem('authToken'); // Remove token from AsyncStorage
    authStore.isAuthenticated = false; // Set the isAuthenticated flag to false
  }

  const [contactModalVisible, setContactModalVisible] = useState(false)
  const [profileModalVisible, setProfileModalVisible] = useState(false) // Declare setProfileModalVisible state

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" tx="demoDebugScreen.title" />
      <View style={$itemsContainer}>
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Id</Text>
              <Text>{Application.applicationId}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Name</Text>
              <Text>{Application.applicationName}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Version</Text>
              <Text>{Application.nativeApplicationVersion}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Build Version</Text>
              <Text>{Application.nativeBuildVersion}</Text>
            </View>
          }
        />
      </View>
      {/* New Change Profile Info Button above Contact Us */}
      <View style={$buttonContainer}>
        <Button style={$button} onPress={() => setProfileModalVisible(true)}>
          Change Profile Info
        </Button>
      </View>
      <View style={$buttonContainer}>
        <Button style={$button} onPress={() => setContactModalVisible(true)}>
          Contact Us
        </Button>
      </View>
      <View style={$buttonContainer}>
        <Button style={$button} tx="common.logOut" onPress={logout} />
      </View>

      <ContactInfoModal visible={contactModalVisible} onClose={() => setContactModalVisible(false)} />
      <ChangeProfileInfoModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} />
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.xxl,
}

const $item: ViewStyle = {
  marginBottom: spacing.md,
}

const $itemsContainer: ViewStyle = {
  marginBottom: spacing.xl,
}

const $button: ViewStyle = {
  marginBottom: spacing.xs,
}

const $buttonContainer: ViewStyle = {
  marginBottom: spacing.md,
}

const modalStyles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  } as ViewStyle,
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: spacing.sm,
    paddingHorizontal: 8,
    width: '100%',
  } as TextStyle,
  innerContainer: {
    width: '80%',
    padding: spacing.lg,
    backgroundColor: colors.palette.neutral100,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, // Shadow effect on Android
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  } as TextStyle,
  info: {
    fontSize: 16,
    marginBottom: spacing.lg,
    textAlign: 'center',
  } as TextStyle,
  button: {
    padding: spacing.sm,
    backgroundColor: colors.tint,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  buttonText: {
    color: colors.palette.neutral100,
    fontSize: 16,
  } as TextStyle,
}
