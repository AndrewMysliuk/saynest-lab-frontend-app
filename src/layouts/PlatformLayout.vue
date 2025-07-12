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

    <TheHeader v-if="!$route.path.includes('/platform/conversation')" />

    <div class="platform-layout__body" :class="[getIsExpiredVisible || getIsTrialVisible ? 'pt-[64px]' : '']">
      <router-view />
    </div>

    <TheFooter is-static v-if="!$route.path.includes('/platform/conversation')" />

    <v-modal :model-value="!getUserLegalTC || !getUserLegalPP || !getUserLegalRP">
      <TheLegal />
    </v-modal>

    <v-modal :model-value="getIsWordModalOpen" @update:model-value="closeWordInfoModal" is-info :is-slide-out-bottom="!isDesktop">
      <TheWordInfo />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent, onBeforeMount, onMounted } from "vue"
import { orgStore, plansStore, subscriptionStore, userStore, vocabularyStore } from "@/app"
import { TheNotification, TheLegal, TheWordInfo, TheHeader, TheFooter } from "@/shared/components"
import { useRouter } from "vue-router"
import { subscriptionCheckMiddleware } from "@/shared/middleware"
import { formatDateTime, isLg } from "@/shared/lib"

const VITE_PADDLE_TOKEN: string = import.meta.env.VITE_PADDLE_TOKEN
const VITE_DEV: boolean = import.meta.env.DEV

export default defineComponent({
  components: {
    TheNotification,
    TheLegal,
    TheWordInfo,
    TheHeader,
    TheFooter,
  },

  setup() {
    const router = useRouter()
    const isDesktop = ref<boolean>(isLg())

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

      const trialEndsAt = getCurrentSubscription.value?.trial_dates?.ends_at

      if (!org || !plan || !trialEndsAt) {
        return ""
      }

      const { session_count, review_count, task_count } = org.trial_usage
      const { session_count_limit, review_count_limit, task_count_limit } = plan.trial_info

      return `Your trial is active until ${formatDateTime(trialEndsAt)}. You’ve used ${session_count}/${session_count_limit} sessions, ${review_count}/${review_count_limit} reviews, and ${task_count}/${task_count_limit} tasks. You can upgrade to a full plan at any time.`
    })
    const getIsExpiredVisible = computed(() => subscriptionStore.getIsExpiredVisible)
    const getIsTrialVisible = computed(() => subscriptionStore.getIsTrialVisible)
    const getIsWordModalOpen = computed(() => vocabularyStore.getIsWordModalOpen)

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
              }, 3000)
            }
          },
        })
      }
    }

    const closeWordInfoModal = () => {
      vocabularyStore.setIsWordModalOpen(false)
    }

    return {
      isDesktop,
      getUserLegalTC,
      getUserLegalPP,
      getUserLegalRP,
      getIsExpiredVisible,
      getIsTrialVisible,
      getIsWordModalOpen,
      trialInfoMessage,
      closeWordInfoModal,
    }
  },
})
</script>

<style lang="scss" scoped>
.platform-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__body {
    flex-grow: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
}
</style>
