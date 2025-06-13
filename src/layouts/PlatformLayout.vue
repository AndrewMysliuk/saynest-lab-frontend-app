<template>
  <div class="platform-layout">
    <TheNotification v-if="getIsTrialVisible" is-link-enabled link-title="Click here" :message="trialInfoMessage" type="trial" @link-click="() => $router.push({ name: 'platform.tariff-plans' })" />

    <TheNotification
      v-else-if="getIsExpiredVisible"
      is-link-enabled
      link-title="Click here"
      message="Your subscription has expired. Renew to continue."
      type="expired"
      @link-click="() => $router.push({ name: 'platform.tariff-plans' })"
    />

    <div :class="[getIsExpiredVisible || getIsTrialVisible ? 'pt-[64px]' : '']">
      <router-view />
    </div>

    <v-modal :model-value="!getUserLegalTC || !getUserLegalPP || !getUserLegalRP">
      <TheLegal />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted } from "vue"
import { orgStore, plansStore, subscriptionStore, userStore } from "@/app"
import { TheNotification, TheLegal } from "@/shared/components"
import { useRouter } from "vue-router"
import { subscriptionCheckMiddleware } from "@/shared/middleware"

const VITE_PADDLE_TOKEN: string = import.meta.env.VITE_PADDLE_TOKEN
const VITE_DEV: boolean = import.meta.env.DEV

export default defineComponent({
  components: {
    TheNotification,
    TheLegal,
  },

  setup() {
    const router = useRouter()

    const getUserLegalTC = computed(() => userStore.getUserLegal?.is_accept_terms_and_conditions)
    const getUserLegalPP = computed(() => userStore.getUserLegal?.is_accept_privacy_policy)
    const getUserLegalRP = computed(() => userStore.getUserLegal?.is_accept_refund_policy)
    const getCurrentUser = computed(() => userStore.getCurrentUser)
    const getCurrentOrg = computed(() => orgStore.getCurrentOrg)
    const getCurrentPlan = computed(() => plansStore.getCurrentPlan)
    const getCurrentSubscription = computed(() => subscriptionStore.getCurrentSubscription)
    const trialInfoMessage = computed(() => {
      const org = getCurrentOrg.value
      const plan = getCurrentPlan.value

      if (!org || !plan) {
        return ""
      }

      const { session_count, review_count, task_count } = org.trial_usage
      const { session_limit, review_limit, task_limit } = plan.trial_info

      return `You have a trial period: ${session_count}/${session_limit} sessions, ${review_count}/${review_limit} reviews, ${task_count}/${task_limit} tasks. You can switch to a full plan anytime.`
    })
    const getIsExpiredVisible = computed(() => subscriptionStore.getIsExpiredVisible)
    const getIsTrialVisible = computed(() => subscriptionStore.getIsTrialVisible)

    onBeforeMount(() => {
      if (!getCurrentSubscription.value) {
        router.push({ name: "platform.tariff-plans" })
      }
    })

    onMounted(() => {
      hotjarUserData()
      paddleSetup()
    })

    const hotjarUserData = () => {
      if (typeof window !== "undefined" && window.hj && getCurrentUser.value) {
        window.hj("identify", getCurrentUser.value._id, {
          explanation_language: getCurrentUser.value.explanation_language,
          country: getCurrentUser.value.country,
        })
      }
    }

    const paddleSetup = () => {
      if (window.Paddle) {
        const environment = VITE_DEV ? "sandbox" : "production"
        window.Paddle.Environment.set(environment)
        window.Paddle.Initialize({
          token: VITE_PADDLE_TOKEN,
          eventCallback: function (data: any) {
            if (data?.name === "checkout.completed") {
              setTimeout(() => {
                subscriptionCheckMiddleware()
              }, 1000)
            }
          },
        })
      }
    }

    return {
      getUserLegalTC,
      getUserLegalPP,
      getUserLegalRP,
      getIsExpiredVisible,
      getIsTrialVisible,
      trialInfoMessage,
    }
  },
})
</script>

<style lang="scss" scoped>
.platform-layout {
  min-height: 100vh;
}
</style>
