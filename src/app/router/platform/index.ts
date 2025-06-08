import { RouteRecordRaw } from "vue-router"
import { authStore, commonStore, communicationReviewStore, orgStore, plansStore, promptStore, userStore } from "@/app"
import PlatformLayout from "@/layouts/PlatformLayout.vue"
import { subscriptionCheckMiddleware } from "@/shared/middleware"

const platform: RouteRecordRaw[] = [
  {
    path: "/platform",
    name: "platform",
    component: PlatformLayout,
    beforeEnter: async (_to, _from, next) => {
      const isLogged = authStore.getIsLogged
      const currentUser = userStore.getCurrentUser

      if (!isLogged) {
        next({ name: "auth.login" })
        return
      }

      commonStore.setIsPageLoading(true)

      if (!currentUser) {
        await userStore.fetchGetUser()
      }

      await subscriptionCheckMiddleware()

      // Reset Infinite Load Params
      communicationReviewStore.resetReviewsParams()
      promptStore.resetModuleParams()
      promptStore.resetPromptParams()

      await Promise.all([
        orgStore.fetchOrgById(),
        communicationReviewStore.fetchReviewsList(false),
        promptStore.fetchModuleList(false),
        promptStore.fetchScenariosList(false, { is_module_only: false }),
        plansStore.fetchPlansList(),
      ]).catch((error: unknown) => console.error("Error in setupOnloadMethods:", error))

      commonStore.setIsPageLoading(false)

      next()
    },

    redirect: {
      name: "platform.conversation-dashboard",
    },

    children: [
      {
        path: "/platform/conversation",
        name: "platform.conversation",
        component: async () => await import("@/pages").then((module) => module.ConversationPagePlatform),
      },
      {
        path: "/platform/conversation-dashboard",
        name: "platform.conversation-dashboard",
        component: async () => await import("@/pages").then((module) => module.ConversationDashboardPagePlatform),
      },
      {
        path: "/platform/conversation-history/:id?",
        name: "platform.conversation-history",
        component: async () => await import("@/pages").then((module) => module.ConversationHistoryPagePlatform),
      },
      {
        path: "/platform/user-progress",
        name: "platform.user-progress",
        component: async () => await import("@/pages").then((module) => module.UserProgressPagePlatform),
      },
      {
        path: "/platform/tariff-plans",
        name: "platform.tariff-plans",
        component: async () => await import("@/pages").then((module) => module.TariffPlansPagePlatform),
      },
    ],
  },
]

export default platform
