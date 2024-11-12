import React, { FC } from "react"
import { Button, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { isRTL } from "../i18n"
import { i18n } from "../i18n" // Assuming i18n is properly set up

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
          <View style={$subscriptionOption}>
            <Text tx="demoCommunityScreen.basicSubscriptionDescription" style={$description} />
            <Text style={$price}>${i18n.t("demoCommunityScreen.basicSubscriptionPrice")}</Text>
            <Button title={i18n.t("demoCommunityScreen.purchaseButton")} onPress={() => handlePurchase("basic")} />
            <Button title={i18n.t("demoCommunityScreen.viewBenefitsButton")} onPress={() => handleViewBenefits("basic")} />
          </View>

          {/* Premium Subscription */}
          <View style={$subscriptionOption}>
            <Text tx="demoCommunityScreen.premiumSubscriptionDescription" style={$description} />
            <Text style={$price}>${i18n.t("demoCommunityScreen.premiumSubscriptionPrice")}</Text>
            <Button title={i18n.t("demoCommunityScreen.purchaseButton")} onPress={() => handlePurchase("premium")} />
            <Button title={i18n.t("demoCommunityScreen.viewBenefitsButton")} onPress={() => handleViewBenefits("premium")} />
          </View>

          {/* Gold Subscription */}
          <View style={$subscriptionOption}>
            <Text tx="demoCommunityScreen.goldSubscriptionDescription" style={$description} />
            <Text style={$price}>${i18n.t("demoCommunityScreen.goldSubscriptionPrice")}</Text>
            <Button title={i18n.t("demoCommunityScreen.purchaseButton")} onPress={() => handlePurchase("gold")} />
            <Button title={i18n.t("demoCommunityScreen.viewBenefitsButton")} onPress={() => handleViewBenefits("gold")} />
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

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
}

const $tagline: TextStyle = {
  marginBottom: spacing.xxl,
}

const $description: TextStyle = {
  marginBottom: spacing.lg,
}

const $sectionTitle: TextStyle = {
  marginTop: spacing.xxl,
}

const $subscriptionOptionsContainer: ViewStyle = {
  marginTop: spacing.xxl,
}

const $subscriptionOption: ViewStyle = {
  padding: spacing.lg,
  marginBottom: spacing.lg,
  borderWidth: 1,
  borderRadius: 8,
  borderColor: "#ccc",
}

const $price: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  marginTop: spacing.sm,
}

