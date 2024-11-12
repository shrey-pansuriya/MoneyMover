import React, { FC } from "react"
import { Button, Image, TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { i18n } from "../i18n"

// Image imports (if used in the future)
const chainReactLogo = require("../../assets/images/demo/cr-logo.png")
const reactNativeLiveLogo = require("../../assets/images/demo/rnl-logo.png")
const reactNativeRadioLogo = require("../../assets/images/demo/rnr-logo.png")
const reactNativeNewsletterLogo = require("../../assets/images/demo/rnn-logo.png")

export const DemoCommunityScreen: FC<DemoTabScreenProps<"DemoCommunity">> =
  function DemoCommunityScreen(_props) {
    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" tx="demoCommunityScreen.subscriptionOptionsTitle" style={$title} />
        <Text tx="demoCommunityScreen.subscriptionOptionsSubtitle" style={$tagline} />

        <View style={$subscriptionOptionsContainer}>
          {/* Basic Subscription */}
          <View style={[$subscriptionOption, { backgroundColor: "#f0f0f0" }]}>
            <Text tx="demoCommunityScreen.basicSubscriptionDescription" style={$description} />
            <Text style={$price}>${i18n.t("demoCommunityScreen.basicSubscriptionPrice")}</Text>
            <View style={$buttonRow}>
              <Button title={i18n.t("demoCommunityScreen.purchaseButton")} onPress={() => handlePurchase("basic")} color="#888" />
              <Button title={i18n.t("demoCommunityScreen.viewBenefitsButton")} onPress={() => handleViewBenefits("basic")} color="#888" />
            </View>
          </View>

          {/* Premium Subscription */}
          <View style={[$subscriptionOption, { backgroundColor: "#2ecc71" }]}>
            <Text tx="demoCommunityScreen.premiumSubscriptionDescription" style={$description} />
            <Text style={$price}>${i18n.t("demoCommunityScreen.premiumSubscriptionPrice")}</Text>
            <View style={$buttonRow}>
              <Button title={i18n.t("demoCommunityScreen.purchaseButton")} onPress={() => handlePurchase("premium")} color="#fff" />
              <Button title={i18n.t("demoCommunityScreen.viewBenefitsButton")} onPress={() => handleViewBenefits("premium")} color="#fff" />
            </View>
          </View>

          {/* Gold Subscription */}
          <View style={[$subscriptionOption, { backgroundColor: "#f39c12" }]}>
            <Text tx="demoCommunityScreen.goldSubscriptionDescription" style={$description} />
            <Text style={$price}>${i18n.t("demoCommunityScreen.goldSubscriptionPrice")}</Text>
            <View style={$buttonRow}>
              <Button title={i18n.t("demoCommunityScreen.purchaseButton")} onPress={() => handlePurchase("gold")} color="#fff" />
              <Button title={i18n.t("demoCommunityScreen.viewBenefitsButton")} onPress={() => handleViewBenefits("gold")} color="#fff" />
            </View>
          </View>
        </View>

      </Screen>
    )
  }

const handlePurchase = (subscriptionType: string) => {
  // Implement purchase logic here
  console.log(`Purchasing ${subscriptionType} plan`)
}

const handleViewBenefits = (subscriptionType: string) => {
  // Implement benefits viewing logic here
  console.log(`Viewing benefits of ${subscriptionType} plan`)
}

// Styles
const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
  fontSize: 30, // Bigger title for emphasis
  fontWeight: "bold",
  color: "#333",
}

const $tagline: TextStyle = {
  marginBottom: spacing.xxl,
  fontSize: 18,
  color: "#666",
}

const $description: TextStyle = {
  marginBottom: spacing.sm,
  fontSize: 16,
  color: "#333",
}

const $subscriptionOptionsContainer: ViewStyle = {
  marginTop: spacing.xxl,
}

const $subscriptionOption: ViewStyle = {
  padding: spacing.lg,
  marginBottom: spacing.lg,
  borderRadius: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
}

const $price: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  marginTop: spacing.sm,
  color: "#fff",
}

const $buttonRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: spacing.lg,
}

