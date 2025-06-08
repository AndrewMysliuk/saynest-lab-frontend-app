import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { ISubscriptionEntity, SubscriptionTypeEnum } from "../types"
import { getSubsByOrgIdHandler } from "../api"

export const useSubscriptionStore = defineStore("subscriptionStore", () => {
  const currentSubscription = ref<ISubscriptionEntity | null>(null)
  const isExpiredVisible = ref<boolean>(false)
  const isTrialVisible = ref<boolean>(false)

  const getCurrentSubscription = computed(() => currentSubscription.value)
  const getIsExpiredVisible = computed(() => isExpiredVisible.value)
  const getIsTrialVisible = computed(() => isTrialVisible.value)

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

  return {
    getCurrentSubscription,
    getIsExpiredVisible,
    getIsTrialVisible,
    setIsTrialVisible,
    setIsExpiredVisible,
    fetchCurrentSubscription,
  }
})
