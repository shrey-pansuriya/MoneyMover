import React, { FC, useState } from "react"
import { Button, TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { i18n } from "../i18n"

export const DemoCommunityScreen: FC<DemoTabScreenProps<"DemoCommunity">> =
  function DemoCommunityScreen(_props) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

    const handleSelectPlan = (plan: string) => {
      setSelectedPlan(plan)
    }

    const handleCancelSubscription = (plan: string) => {
      setSelectedPlan(null)
      console.log(`Cancelled subscription for ${plan} plan`)
    }

    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" tx="demoCommunityScreen.subscriptionOptionsTitle" style={$title} />
        <Text tx="demoCommunityScreen.subscriptionOptionsSubtitle" style={$tagline} />

        <View style={$subscriptionOptionsContainer}>
          {/* Basic Subscription */}
          <View
            style={[
              $subscriptionOption,
              { backgroundColor: "#2f2f2f", opacity: selectedPlan === "basic" ? 0.5 : 1 }
            ]}
          >
            <Text style={[$planName, { color: "#fff" }]}>BASIC - $200</Text>
            <Text style={[$description, { color: "#fff" }]}>
              {i18n.t("demoCommunityScreen.basicSubscriptionDescription")}
            </Text>
            <View style={$buttonWrapper}>
              <View style={$buttonContainer}>
                <Button
                  title={selectedPlan === "basic" ? "Active" : i18n.t("demoCommunityScreen.purchaseButton")}
                  onPress={() => {
                    if (selectedPlan === "basic") {
                      handleCancelSubscription("basic")
                    } else {
                      handleSelectPlan("basic")
                    }
                  }}
                  color="black"
                />
              </View>
              <View style={$buttonContainer}>
                <Button
                  title={selectedPlan === "basic" ? "Cancel Subscription" : i18n.t("demoCommunityScreen.viewBenefitsButton")}
                  onPress={() => {
                    if (selectedPlan === "basic") {
                      handleCancelSubscription("basic")
                    }
                  }}
                  color="black"
                />
              </View>
            </View>
          </View>

          {/* Premium Subscription */}
          <View
            style={[
              $subscriptionOption,
              { backgroundColor: "#2ecc71", opacity: selectedPlan === "premium" ? 0.5 : 1 }
            ]}
          >
            <Text style={[$planName, { color: "#000" }]}>PREMIUM - $300</Text>
            <Text style={$description}>
              {i18n.t("demoCommunityScreen.premiumSubscriptionDescription")}
            </Text>
            <View style={$buttonWrapper}>
              <View style={$buttonContainer}>
                <Button
                  title={selectedPlan === "premium" ? "Active" : i18n.t("demoCommunityScreen.purchaseButton")}
                  onPress={() => {
                    if (selectedPlan === "premium") {
                      handleCancelSubscription("premium")
                    } else {
                      handleSelectPlan("premium")
                    }
                  }}
                  color="black"
                />
              </View>
              <View style={$buttonContainer}>
                <Button
                  title={selectedPlan === "premium" ? "Cancel Subscription" : i18n.t("demoCommunityScreen.viewBenefitsButton")}
                  onPress={() => {
                    if (selectedPlan === "premium") {
                      handleCancelSubscription("premium")
                    }
                  }}
                  color="black"
                />
              </View>
            </View>
          </View>

          {/* Gold Subscription */}
          <View
            style={[
              $subscriptionOption,
              { backgroundColor: "#f39c12", opacity: selectedPlan === "gold" ? 0.5 : 1 }
            ]}
          >
            <Text style={[$planName, { color: "#000" }]}>GOLD - $400</Text>
            <Text style={$description}>
              {i18n.t("demoCommunityScreen.goldSubscriptionDescription")}
            </Text>
            <View style={$buttonWrapper}>
              <View style={$buttonContainer}>
                <Button
                  title={selectedPlan === "gold" ? "Active" : i18n.t("demoCommunityScreen.purchaseButton")}
                  onPress={() => {
                    if (selectedPlan === "gold") {
                      handleCancelSubscription("gold")
                    } else {
                      handleSelectPlan("gold")
                    }
                  }}
                  color="black"
                />
              </View>
              <View style={$buttonContainer}>
                <Button
                  title={selectedPlan === "gold" ? "Cancel Subscription" : i18n.t("demoCommunityScreen.viewBenefitsButton")}
                  onPress={() => {
                    if (selectedPlan === "gold") {
                      handleCancelSubscription("gold")
                    }
                  }}
                  color="black"
                />
              </View>
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

const $planName: TextStyle = {
  fontSize: 48, // Significantly larger text for plan name
  fontWeight: "bold",
  marginBottom: spacing.sm,
  lineHeight: 55, // Increased line height to prevent cutting off
}

const $description: TextStyle = {
  marginBottom: spacing.sm,
  fontSize: 16,
}

const $subscriptionOptionsContainer: ViewStyle = {
  marginTop: spacing.xxl,
}

const $subscriptionOption: ViewStyle = {
  padding: spacing.xl, // Increased padding for bigger box
  marginBottom: spacing.lg,
  borderRadius: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  minHeight: 250, // Increased minimum height to accommodate larger text
}

const $buttonWrapper: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: spacing.lg,
}

const $buttonContainer: ViewStyle = {
  backgroundColor: "#fff",
  borderRadius: 5,
  overflow: "hidden",
  flex: 1,
  marginHorizontal: 5,
  justifyContent: "center",
  paddingVertical: 0, // Removes any vertical padding
  paddingHorizontal: 0, // Removes any horizontal padding
}
