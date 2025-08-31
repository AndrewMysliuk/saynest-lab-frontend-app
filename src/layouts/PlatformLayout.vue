<template>
  <div class="platform-layout">
    <TheNotification
      v-if="getIsTrialVisible"
      is-link-enabled
      :link-title="t('layout.click_here')"
      :message="trialInfoMessage"
      type="trial"
      @link-click="() => $router.push({ name: 'platform.tariff-plans' })"
    />

    <TheNotification
      v-else-if="getIsExpiredVisible"
      is-link-enabled
      :link-title="t('layout.click_here')"
      :message="t('layout.expired_message')"
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
import { computed, ref, defineComponent, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { orgStore, plansStore, subscriptionStore, userStore, vocabularyStore } from "@/app"
import { TheNotification, TheLegal, TheWordInfo, TheHeader, TheFooter } from "@/shared/components"
import { subscriptionCheckMiddleware } from "@/shared/middleware"
import { formatDateTime, isLg } from "@/shared/lib"

const VITE_PADDLE_TOKEN: string = import.meta.env.VITE_PADDLE_TOKEN
const VITE_DEV: boolean = import.meta.env.DEV

export default defineComponent({
  components: { TheNotification, TheLegal, TheWordInfo, TheHeader, TheFooter },
  setup() {
    const { t } = useI18n()
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
      if (!org || !plan || !trialEndsAt) return ""

      const { session_count, review_count, task_count } = org.trial_usage
      const { session_count_limit, review_count_limit, task_count_limit } = plan.trial_info

      return t("layout.trial_message", {
        date: formatDateTime(trialEndsAt),
        sessionsUsed: session_count,
        sessionsLimit: session_count_limit,
        reviewsUsed: review_count,
        reviewsLimit: review_count_limit,
        tasksUsed: task_count,
        tasksLimit: task_count_limit,
      })
    })

    const getIsExpiredVisible = computed(() => subscriptionStore.getIsExpiredVisible)
    const getIsTrialVisible = computed(() => subscriptionStore.getIsTrialVisible)
    const getIsWordModalOpen = computed(() => vocabularyStore.getIsWordModalOpen)

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
      t,
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
  min-height: 100dvh;
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
