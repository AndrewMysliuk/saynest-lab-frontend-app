<template>
  <div>
    <TheLoader v-if="getIsPageLoading" />

    <div class="pt-16" v-else>
      <div class="px-6 py-10">
        <h1 class="text-3xl font-bold text-text-base mb-6">Tariff Plan</h1>

        <div class="flex justify-center gap-8 flex-wrap">
          <div v-for="plan in getPlansList" :key="plan._id" class="bg-gray-100 rounded-2xl shadow-lg p-8 flex flex-col justify-between w-96 min-h-[450px] hover:shadow-xl transition relative">
            <div v-if="isSubscribed(plan._id) && !isCancelled" class="absolute top-4 right-4 text-xs bg-green-500 text-white px-2 py-1 rounded">Current Plan</div>
            <div v-if="isSubscribed(plan._id) && isCancelled" class="absolute top-4 right-4 text-xs bg-red-500 text-white px-2 py-1 rounded">Cancelled Plan</div>

            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ plan.name }}</h2>
              <p class="text-gray-700 mb-6 text-base">{{ plan.description }}</p>

              <ul class="mb-6 space-y-2">
                <li v-for="(feature, index) in plan.features" :key="index" class="flex items-center text-gray-800 text-base">
                  <span class="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <div>
              <div class="text-xl font-semibold text-gray-900 mb-6">{{ plan.amount }} {{ plan.currency }} / {{ plan.billing_period.toLowerCase() }}</div>

              <template v-if="isSubscribed(plan._id)">
                <button
                  v-if="isTrialing && !isPendingCancel"
                  type="button"
                  class="bg-indigo-600 text-white text-lg font-medium px-4 py-3 rounded w-full hover:bg-indigo-700 transition"
                  @click="isActiveFromTrialOpen = true"
                >
                  Unlock Full Access
                </button>

                <button
                  v-else-if="isPastDue"
                  type="button"
                  class="bg-orange-500 text-white text-lg font-medium px-4 py-3 rounded w-full hover:bg-orange-600 transition"
                  @click="updatePaymentDetailsLink"
                >
                  Update Payment Method
                </button>

                <button
                  v-else-if="isActive && !isPendingCancel"
                  type="button"
                  class="bg-red-600 text-white text-lg font-medium px-4 py-3 rounded w-full hover:bg-red-700 transition"
                  @click="isUnsubscribedConfirmOpened = true"
                >
                  Cancel Subscription
                </button>

                <button
                  v-else-if="isPendingCancel"
                  type="button"
                  class="bg-indigo-600 text-white text-lg font-medium px-4 py-3 rounded w-full hover:bg-indigo-700 transition"
                  @click="recancelSubscription"
                >
                  Resume Subscription
                </button>

                <template v-else>
                  <button type="button" class="bg-indigo-600 text-white text-lg font-medium px-4 py-3 rounded w-full hover:bg-indigo-700 transition" @click="subscribeMethod(plan)">
                    Start Subscription
                  </button>
                </template>
              </template>

              <template v-else-if="isActiveOrTrialingOrPastDue">
                <button type="button" class="bg-indigo-600 text-white text-lg font-medium px-4 py-3 rounded w-full hover:bg-indigo-700 transition" @click="openChangePlanModal(plan._id)">
                  Change Plan
                </button>
              </template>

              <template v-else-if="!getCurrentSubscription">
                <button type="button" class="bg-indigo-600 text-white text-lg font-medium px-4 py-3 rounded w-full hover:bg-indigo-700 transition" @click="subscribeMethod(plan)">
                  Get Free Trial
                </button>
              </template>

              <template v-else>
                <button type="button" class="bg-indigo-600 text-white text-lg font-medium px-4 py-3 rounded w-full hover:bg-indigo-700 transition" @click="subscribeMethod(plan)">
                  Start Subscription
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <v-modal v-model="isUnsubscribedConfirmOpened">
        <TheConfirmation
          title="Cancel Subscription"
          description="Are you sure you want to cancel your current subscription? You will lose access to all premium features after the end of the billing period."
          @accept="cancelSubscription"
          @cancel="isUnsubscribedConfirmOpened = false"
        />
      </v-modal>

      <v-modal v-model="isActiveFromTrialOpen">
        <TheConfirmation
          title="End Trial Early"
          description="Do you want to end your trial and start your full subscription now? This action cannot be undone — you’ll be charged immediately and won’t be able to return to the trial."
          @accept="unlockFullAccess"
          @cancel="isActiveFromTrialOpen = false"
        />
      </v-modal>

      <v-modal v-model="isChangePlanOpen">
        <TheConfirmation :title="changePlanTitle" :description="changePlanDescription" @accept="changePlan" @cancel="isChangePlanOpen = false" />
      </v-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { commonStore, plansStore, subscriptionStore, userStore } from "@/app"
import { TheLoader, TheConfirmation } from "@/shared/components"
import { IPlanEntity, SubscriptionTypeEnum } from "@/shared/types"
import { getPaymentDetailsLinkHandler } from "@/shared/api"

export default defineComponent({
  components: {
    TheLoader,
    TheConfirmation,
  },

  setup() {
    const isUnsubscribedConfirmOpened = ref<boolean>(false)
    const isActiveFromTrialOpen = ref<boolean>(false)
    const isChangePlanOpen = ref<boolean>(false)
    const selectedPlanId = ref<string>("")

    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)
    const getPlansList = computed(() => plansStore.getPlansList)
    const getCurrentSubscription = computed(() => subscriptionStore.getCurrentSubscription)
    const getCurrentUser = computed(() => userStore.getCurrentUser)
    const isActive = computed(() => getCurrentSubscription.value?.status === SubscriptionTypeEnum.ACTIVE)
    const isTrialing = computed(() => getCurrentSubscription.value?.status === SubscriptionTypeEnum.TRIALING)
    const isCancelled = computed(() => getCurrentSubscription.value?.status === SubscriptionTypeEnum.CANCELLED)
    const isPastDue = computed(() => getCurrentSubscription.value?.status === SubscriptionTypeEnum.PAST_DUE)
    const isPendingCancel = computed(() => getCurrentSubscription.value?.is_pending_cancel)
    const isActiveOrTrialingOrPastDue = computed(() => isActive.value || isTrialing.value || isPastDue.value)
    const changePlanTitle = computed(() => {
      if (isTrialing.value) return "End Trial and Change Plan"
      return "Change Plan"
    })

    const changePlanDescription = computed(() => {
      if (isTrialing.value) {
        return "You are currently in a trial period. Changing your plan now will end the trial immediately and you’ll be charged for the selected plan. Are you sure?"
      }

      return "Your subscription will be updated immediately. Are you sure you want to switch to a different plan?"
    })

    const isSubscribed = (plan_id: string) => {
      if (!getCurrentSubscription.value) return false

      return getCurrentSubscription.value.plan_id === plan_id
    }

    const subscribeMethod = (plan: IPlanEntity) => {
      if (!window.Paddle) {
        console.error("Paddle not found")
        return
      }

      const priceId = getCurrentSubscription.value ? plan.paddle_price_ids.no_trial : plan.paddle_price_ids.trial

      window.Paddle.Checkout.open({
        items: [
          {
            priceId,
            quantity: 1,
          },
        ],
        customer: {
          email: getCurrentUser.value?.email,
          address: {
            countryCode: getCurrentUser.value?.country,
          },
        },
        customData: {
          user_id: getCurrentUser.value?._id,
          organization_id: getCurrentUser.value?.organization_id,
          plan_id: plan._id,
        },
        settings: {
          allowLogout: true,
          allowDiscountRemoval: true,
          allowedPaymentMethods: ["card", "paypal"],
          displayMode: "overlay",
          variant: "multi-page",
          showAddDiscounts: true,
          showAddTaxId: true,
          theme: "light",
          locale: getCurrentUser.value?.explanation_language ?? "en",
        },
      })
    }

    const cancelSubscription = async () => {
      try {
        await subscriptionStore.fetchCancelSubscription()
      } catch (error: unknown) {
        console.log(error)
      } finally {
        isUnsubscribedConfirmOpened.value = false
      }
    }

    const recancelSubscription = async () => {
      try {
        await subscriptionStore.fetchRecancelSubscription()
      } catch (error: unknown) {
        console.log(error)
      }
    }

    const unlockFullAccess = async () => {
      try {
        await subscriptionStore.fetchActivateFromTrialSubscription()
      } catch (error: unknown) {
        console.log(error)
      } finally {
        isActiveFromTrialOpen.value = false
      }
    }

    const updatePaymentDetailsLink = async () => {
      try {
        const url = await getPaymentDetailsLinkHandler()

        window.open(url, "_blank")
      } catch (error: unknown) {
        console.log(error)
      }
    }

    const openChangePlanModal = (plan_id: string) => {
      selectedPlanId.value = plan_id
      isChangePlanOpen.value = true
    }

    const changePlan = async () => {
      try {
        await subscriptionStore.fetchChangePlanSubscription(selectedPlanId.value)
      } catch (error: unknown) {
        console.log(error)
      } finally {
        isChangePlanOpen.value = false
      }
    }

    return {
      isUnsubscribedConfirmOpened,
      isActiveFromTrialOpen,
      isChangePlanOpen,
      getPlansList,
      getIsPageLoading,
      getCurrentSubscription,
      isActive,
      isTrialing,
      isCancelled,
      isPastDue,
      isPendingCancel,
      isActiveOrTrialingOrPastDue,
      changePlanTitle,
      changePlanDescription,
      isSubscribed,
      unlockFullAccess,
      subscribeMethod,
      cancelSubscription,
      recancelSubscription,
      updatePaymentDetailsLink,
      openChangePlanModal,
      changePlan,
      SubscriptionTypeEnum,
    }
  },
})
</script>
