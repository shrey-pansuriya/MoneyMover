import React, { FC, useState } from "react"
import * as Application from "expo-application"
import { Modal, View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { Button, ListItem, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { isRTL } from "../i18n"
import { useStores } from "../models"

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

export const DemoDebugScreen: FC<DemoTabScreenProps<"Settings">> = function DemoDebugScreen(
  _props,
) {
  const {
    authenticationStore: { logout },
  } = useStores()

  const [modalVisible, setModalVisible] = useState(false)

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
      <View style={$buttonContainer}>
        <Button style={$button} onPress={() => setModalVisible(true)}>
          Contact Us
        </Button>
      </View>
      <View style={$buttonContainer}>
        <Button style={$button} tx="common.logOut" onPress={logout} />
      </View>

      <ContactInfoModal visible={modalVisible} onClose={() => setModalVisible(false)} />
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

const $reportBugsLink: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.lg,
  alignSelf: isRTL ? "flex-start" : "flex-end",
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
