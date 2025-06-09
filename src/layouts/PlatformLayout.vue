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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted } from "vue"
import { orgStore, plansStore, subscriptionStore, userStore } from "@/app"
import { TheNotification } from "@/shared/components"
import { useRouter } from "vue-router"

export default defineComponent({
  components: {
    TheNotification,
  },

  setup() {
    const router = useRouter()

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
    })

    const hotjarUserData = () => {
      if (typeof window !== "undefined" && window.hj && getCurrentUser.value) {
        window.hj("identify", getCurrentUser.value._id, {
          explanation_language: getCurrentUser.value.explanation_language,
          country: getCurrentUser.value.country,
        })
      }
    }

    return {
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
