import React, { FC, useState } from "react"
import { Button, TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { i18n } from "../i18n"

export const DemoCommunityScreen: FC<DemoTabScreenProps<"DemoCommunity">> =
  function DemoCommunityScreen(_props) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [showPolicy, setShowPolicy] = useState<string | null>(null)

    const handleSelectPlan = (plan: string) => {
      setSelectedPlan(plan)
    }

    const handleCancelSubscription = (plan: string) => {
      setSelectedPlan(null)
      console.log(`Cancelled subscription for ${plan} plan`)
    }

    const handleViewBenefits = (plan: string) => {
      setShowPolicy(showPolicy === plan ? null : plan)
    }

    const renderPolicies = (plan: string) => {
      switch (plan) {
        case "basic":
          return (
            <Text style={[$policyText, { color: "#fff" }]}>
              - Minimum of 15 days before requesting a claim.{"\n"}
              - Must participate in at least one donation or complete the first subscription payment by the end of the month.{"\n"}
              - Unused funds are transferred to a shared pool if not involved in P2P transactions.
            </Text>
          )
        case "premium":
          return (
            <Text style={[$policyText, { color: "#000" }]}>
              - Minimum of 10 days before requesting a claim.{"\n"}
              - Must participate in a donation or complete the first subscription payment by the end of the month.{"\n"}
              - Unused funds go to the shared pool if not used for P2P transactions.{"\n"}
              - Higher priority in claims over Basic members.
            </Text>
          )
        case "gold":
          return (
            <Text style={[$policyText, { color: "#000" }]}>
              - Minimum of 5 days before requesting a claim.{"\n"}
              - Must participate in a donation or complete the first subscription payment by the end of the month.{"\n"}
              - Unused funds go to the shared pool if not involved in P2P transactions.{"\n"}
              - Highest priority in claims, followed by Premium, then Basic members.
            </Text>
          )
        default:
          return null
      }
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
              { backgroundColor: "#2f2f2f", opacity: selectedPlan && selectedPlan !== "basic" ? 0.5 : 1 }
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
                  title={showPolicy === "basic" ? "Hide Benefits" : i18n.t("demoCommunityScreen.viewBenefitsButton")}
                  onPress={() => handleViewBenefits("basic")}
                  color="black"
                />
              </View>
            </View>
            {showPolicy === "basic" && renderPolicies("basic")}
          </View>

          {/* Premium Subscription */}
          <View
            style={[
              $subscriptionOption,
              { backgroundColor: "#2ecc71", opacity: selectedPlan && selectedPlan !== "premium" ? 0.5 : 1 }
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
                  title={showPolicy === "premium" ? "Hide Benefits" : i18n.t("demoCommunityScreen.viewBenefitsButton")}
                  onPress={() => handleViewBenefits("premium")}
                  color="black"
                />
              </View>
            </View>
            {showPolicy === "premium" && renderPolicies("premium")}
          </View>

          {/* Gold Subscription */}
          <View
            style={[
              $subscriptionOption,
              { backgroundColor: "#f39c12", opacity: selectedPlan && selectedPlan !== "gold" ? 0.5 : 1 }
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
                  title={showPolicy === "gold" ? "Hide Benefits" : i18n.t("demoCommunityScreen.viewBenefitsButton")}
                  onPress={() => handleViewBenefits("gold")}
                  color="black"
                />
              </View>
            </View>
            {showPolicy === "gold" && renderPolicies("gold")}
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
// New Policy Text Style
const $policyText: TextStyle = {
  marginTop: spacing.md,
  fontSize: 14,
  fontWeight: "bold", // Added this line to make it bold
}