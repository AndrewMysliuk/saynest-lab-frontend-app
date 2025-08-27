import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { ISubscriptionEntity, SubscriptionTypeEnum } from "../types"
import { activateFromTrialSubscriptionHandler, cancelSubscriptionHandler, changePlanSubscriptionHandler, getSubsByOrgIdHandler, recancelSubscriptionHandler } from "../api"

export const useSubscriptionStore = defineStore("subscriptionStore", () => {
  const currentSubscription = ref<ISubscriptionEntity | null>(null)
  const isExpiredVisible = ref<boolean>(false)
  const isTrialVisible = ref<boolean>(false)
  const isHasSubscription = ref<boolean>(false)

  const getCurrentSubscription = computed(() => currentSubscription.value)
  const getIsExpiredVisible = computed(() => isExpiredVisible.value)
  const getIsTrialVisible = computed(() => isTrialVisible.value)
  const getIsHasSubscription = computed(() => isHasSubscription.value)

  const setIsHasSubscription = (value: boolean) => {
    isHasSubscription.value = value
  }

  const setIsExpiredVisible = (value: boolean) => {
    isExpiredVisible.value = value
  }

  const setIsTrialVisible = (value: boolean) => {
    isTrialVisible.value = value
  }

  const fetchCurrentSubscription = async () => {
    return getSubsByOrgIdHandler()
      .then((response: ISubscriptionEntity | null) => {
        currentSubscription.value = response

        if (response?.status === SubscriptionTypeEnum.TRIALING) {
          setIsTrialVisible(true)
        }

        return response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchCancelSubscription = async () => {
    return cancelSubscriptionHandler()
      .then((response: ISubscriptionEntity | null) => {
        currentSubscription.value = response

        return response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchRecancelSubscription = async () => {
    return recancelSubscriptionHandler()
      .then((response: ISubscriptionEntity | null) => {
        currentSubscription.value = response

        return response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchActivateFromTrialSubscription = async () => {
    return activateFromTrialSubscriptionHandler()
      .then((response: ISubscriptionEntity | null) => {
        currentSubscription.value = response

        setIsTrialVisible(false)

        return response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchChangePlanSubscription = async (plan_id: string) => {
    return changePlanSubscriptionHandler(plan_id)
      .then((response: ISubscriptionEntity | null) => {
        currentSubscription.value = response

        setIsTrialVisible(false)

        return response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getCurrentSubscription,
    getIsExpiredVisible,
    getIsTrialVisible,
    getIsHasSubscription,
    setIsHasSubscription,
    setIsTrialVisible,
    setIsExpiredVisible,
    fetchCurrentSubscription,
    fetchCancelSubscription,
    fetchRecancelSubscription,
    fetchActivateFromTrialSubscription,
    fetchChangePlanSubscription,
  }
})
