<template>
  <div class="flex-grow min-h-0 bg-gray-50">
    <TheLoader v-if="getIsPageLoading" />

    <div
      v-else
      class="relative pb-10 pt-[104px] md:pb-14 md:pt-[132px] px-4 before:absolute before:inset-0 before:-z-1 before:mx-3 lg:before:mx-6 2xl:before:mx-10 before:bg-linear-to-b before:from-gray-100 before:to-transparent before:rounded-2xl"
    >
      <div class="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        <!-- Heading -->
        <div class="mb-8 max-w-2xl mx-auto text-center">
          <h1 class="font-bold text-gray-800 text-4xl md:text-5xl">Overview our plans</h1>

          <p class="mt-5 text-sm md:text-lg text-gray-800">Here you can view all available subscription plans and their features</p>
        </div>
        <!-- End Heading -->

        <!-- Switch -->
        <!-- <div id="toggle-count" class="flex justify-center items-center gap-x-3">
          <label for="pricing-switch" class="text-sm text-gray-800">Monthly</label>
          <label for="pricing-switch" class="relative inline-block w-11 h-6 cursor-pointer">
            <input type="checkbox" id="pricing-switch" class="peer sr-only" checked />
            <span
              class="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-[#4F46E5] peer-disabled:opacity-50 peer-disabled:pointer-events-none"
            ></span>
            <span class="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
          </label>
          <label for="pricing-switch" class="text-sm text-gray-800">Annually</label>
        </div> -->
        <!-- End Switch -->
      </div>

      <div class="my-8">
        <div class="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
          <!-- Grid -->
          <div class="flex flex-wrap justify-center gap-4">
            <!-- Card -->
            <div
              v-for="plan in getPlansList"
              class="relative p-4 md:p-6 min-h-[460px] h-full flex flex-col w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] max-w-full bg-white border border-gray-200 rounded-xl shadow-xs"
            >
              <div v-if="isSubscribed(plan._id) && !isCancelled" class="absolute top-[26px] right-[24px] text-xs bg-green-600 text-white px-2 py-1 rounded">Current Plan</div>
              <div v-if="isSubscribed(plan._id) && isCancelled" class="absolute top-[26px] right-[24px] text-xs bg-red-500 text-white px-2 py-1 rounded">Cancelled Plan</div>

              <!-- Header -->
              <header class="flex flex-col">
                <h4 class="font-semibold text-lg text-gray-800">{{ plan.name }}</h4>

                <div class="mt-2">
                  <p class="text-sm text-gray-500">{{ plan.description }}</p>
                </div>
              </header>
              <!-- End Header -->

              <!-- Body -->
              <div class="flex flex-col">
                <!-- Price -->
                <div class="mt-4 flex items-start gap-x-1">
                  <span class="font-semibold text-gray-800 text-xl">€</span>
                  <span class="font-semibold text-3xl md:text-4xl text-gray-800"> {{ plan.amount }} </span>
                  <span class="block mt-0.5 text-gray-800"> {{ plan.currency }} </span>
                </div>
                <!-- End Price -->

                <p class="text-xs text-gray-500">{{ plan.billing_period.toLowerCase() }} for one person</p>

                <div class="mt-5 pb-7 border-b border-gray-200">
                  <template v-if="isSubscribed(plan._id)">
                    <button
                      v-if="isTrialing && !isPendingCancel"
                      id="UNLOCK_FULL_ACCESS_CLICKED"
                      type="button"
                      @click="isActiveFromTrialOpen = true"
                      class="py-2 px-2.5 w-full inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:shadow-none focus:outline-none focus:bg-[#4338CA] focus:shadow-none disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Unlock Full Access
                    </button>

                    <button
                      v-else-if="isPastDue"
                      type="button"
                      @click="updatePaymentDetailsLink"
                      class="py-2 px-2.5 w-full inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:shadow-none focus:outline-none focus:bg-[#4338CA] focus:shadow-none disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Update Payment Method
                    </button>

                    <button
                      v-else-if="isActive && !isPendingCancel"
                      id="CANCEL_SUBSCRIPTION_CLICKED"
                      type="button"
                      @click="isUnsubscribedConfirmOpened = true"
                      class="py-2 px-2.5 w-full inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Cancel Subscription
                    </button>

                    <button
                      v-else-if="isPendingCancel"
                      type="button"
                      @click="recancelSubscription"
                      class="py-2 px-2.5 w-full inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:shadow-none focus:outline-none focus:bg-[#4338CA] focus:shadow-none disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Resume Subscription
                    </button>

                    <template v-else>
                      <button
                        id="START_SUBSCRIPTION_CLICKED"
                        type="button"
                        @click="subscribeMethod(plan)"
                        class="py-2 px-2.5 w-full inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:shadow-none focus:outline-none focus:bg-[#4338CA] focus:shadow-none disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Start Subscription
                      </button>
                    </template>
                  </template>

                  <template v-else-if="isActiveOrTrialingOrPastDue">
                    <button
                      type="button"
                      @click="openChangePlanModal(plan._id)"
                      class="py-2 px-2.5 w-full inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:shadow-none focus:outline-none focus:bg-[#4338CA] focus:shadow-none disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Change Plan
                    </button>
                  </template>

                  <template v-else-if="!getCurrentSubscription">
                    <button
                      id="GET_FREE_TRIAL_CLICKED"
                      type="button"
                      @click="subscribeMethod(plan)"
                      class="py-2 px-2.5 w-full inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:shadow-none focus:outline-none focus:bg-[#4338CA] focus:shadow-none disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Get Free Trial
                    </button>
                  </template>

                  <template v-else>
                    <button
                      id="START_SUBSCRIPTION_CLICKED"
                      type="button"
                      @click="subscribeMethod(plan)"
                      class="py-2 px-2.5 w-full inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:shadow-none focus:outline-none focus:bg-[#4338CA] focus:shadow-none disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Start Subscription
                    </button>
                  </template>
                </div>

                <!-- List -->
                <ul class="mt-7 space-y-2.5 text-sm">
                  <li class="flex items-center gap-x-3" v-for="(feature, index) in plan.features" :key="index">
                    <svg
                      class="shrink-0 size-4 text-gray-800"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span class="text-gray-800"> {{ feature }} </span>
                  </li>
                </ul>
                <!-- End List -->
              </div>
              <!-- End Body -->
            </div>
            <!-- End Card -->
          </div>
          <!-- End Grid -->
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
