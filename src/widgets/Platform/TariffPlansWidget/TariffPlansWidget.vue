<template>
  <div>
    <TheLoader v-if="getIsPageLoading" />

    <div class="pt-16" v-else>
      <div class="px-6 py-10">
        <h1 class="text-3xl font-bold text-text-base mb-6">Tariff Plan</h1>

        <div class="flex justify-center">
          <div v-for="plan in getPlansList" :key="plan._id" class="bg-gray-100 rounded-2xl shadow-lg p-8 flex flex-col justify-between w-96 min-h-[450px] hover:shadow-xl transition">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                {{ plan.name }}
              </h2>
              <p class="text-gray-700 mb-6 text-base">
                {{ plan.description }}
              </p>

              <ul class="mb-6 space-y-2">
                <li v-for="(feature, index) in plan.features" :key="index" class="flex items-center text-gray-800 text-base">
                  <span class="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <div>
              <div class="text-xl font-semibold text-gray-900 mb-6">
                {{ plan.amount }} {{ plan.currency }} /
                {{ plan.billing_period.toLowerCase() }}
              </div>

              <button
                v-if="!isSubscribed(plan._id)"
                type="button"
                class="bg-indigo-600 text-white text-lg font-medium px-4 py-3 rounded w-full hover:bg-indigo-700 transition"
                @click="subscribeMethod"
              >
                Subscribe
              </button>
              <button
                v-else-if="getCurrentSubscription?.status === SubscriptionTypeEnum.TRIALING"
                type="button"
                class="bg-indigo-600 text-white text-lg font-medium px-4 py-3 rounded w-full hover:bg-indigo-700 transition"
                @click="unlockFullAccess"
              >
                Unlock Full Access
              </button>
              <button v-else type="button" class="px-4 py-2 bg-red-600 text-white w-full rounded-md hover:bg-red-700 transition" @click="isUnsubscribedConfirmOpened = true">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      </div>

      <v-modal v-model="isUnsubscribedConfirmOpened">
        <TheConfirmation
          title="Cancel Subscription"
          description="Are you sure you want to cancel your current subscription? You will lose access to all premium features after the end of the billing period."
          @accept="unsubscribedMethod"
          @cancel="isUnsubscribedConfirmOpened = false"
        />
      </v-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { commonStore, plansStore, subscriptionStore } from "@/app"
import { TheLoader, TheConfirmation } from "@/shared/components"
import { SubscriptionTypeEnum } from "@/shared/types"

export default defineComponent({
  components: {
    TheLoader,
    TheConfirmation,
  },

  setup() {
    const isUnsubscribedConfirmOpened = ref<boolean>(false)

    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)
    const getPlansList = computed(() => plansStore.getPlansList)
    const getCurrentSubscription = computed(() => subscriptionStore.getCurrentSubscription)

    const isSubscribed = (plan_id: string) => {
      if (!getCurrentSubscription.value) return false

      return getCurrentSubscription.value.plan_id === plan_id
    }

    const subscribeMethod = () => {
      // TODO
    }

    const unsubscribedMethod = () => {
      // TODO
    }

    const unlockFullAccess = () => {
      // TODO
    }

    return {
      isUnsubscribedConfirmOpened,
      getPlansList,
      getIsPageLoading,
      getCurrentSubscription,
      isSubscribed,
      unlockFullAccess,
      subscribeMethod,
      unsubscribedMethod,
      SubscriptionTypeEnum,
    }
  },
})
</script>
