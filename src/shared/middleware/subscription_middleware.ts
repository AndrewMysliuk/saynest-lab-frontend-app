import { plansStore, subscriptionStore } from "@/app"
import { SubscriptionTypeEnum } from "../types"

export const subscriptionCheckMiddleware = async (): Promise<void> => {
  try {
    const subscription = await subscriptionStore.fetchCurrentSubscription()

    subscriptionStore.setIsHasSubscription(!!subscription)

    if (subscription) {
      await plansStore.fetchPlanById(subscription.plan_id)
    }

    if (subscription && ![SubscriptionTypeEnum.ACTIVE, SubscriptionTypeEnum.TRIALING].includes(subscription.status)) {
      subscriptionStore.setIsExpiredVisible(true)

      return
    }

    subscriptionStore.setIsExpiredVisible(false)
  } catch (error) {
    console.error("subscriptionCheckMiddleware error:", error)
    subscriptionStore.setIsHasSubscription(false)
  }
}
