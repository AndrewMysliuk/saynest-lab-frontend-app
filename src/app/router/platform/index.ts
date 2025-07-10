import { RouteRecordRaw } from "vue-router"
import { authStore, commonStore, communicationReviewStore, orgStore, plansStore, promptStore, userStore, vocabularyStore } from "@/app"
import PlatformLayout from "@/layouts/PlatformLayout.vue"
import { subscriptionCheckMiddleware } from "@/shared/middleware"
import { useTawk } from "@/shared/config"

const platform: RouteRecordRaw[] = [
  {
    path: "/platform",
    name: "platform",
    component: PlatformLayout,
    beforeEnter: async (_to, _from, next) => {
      const isLogged = authStore.getIsLogged
      let currentUser = userStore.getCurrentUser

      if (!isLogged) {
        next({ name: "auth.login" })
        return
      }

      commonStore.setIsPageLoading(true)

      if (!currentUser) {
        await userStore.fetchGetUser()
        currentUser = userStore.getCurrentUser
      }

      // Tawk
      const { init, show, setVisitor } = useTawk()

      init()

      if (currentUser) setVisitor(`${currentUser?.first_name} ${currentUser?.last_name}`, currentUser?.email)
      show()

      await subscriptionCheckMiddleware()

      // Reset Infinite Load Params
      communicationReviewStore.resetReviewsParams()
      promptStore.resetModuleParams()
      promptStore.resetPromptParams()

      await Promise.all([
        orgStore.fetchOrgById(),
        communicationReviewStore.fetchReviewsList(false),
        vocabularyStore.listUserWordsMethod(false),
        promptStore.fetchModuleList(false),
        promptStore.fetchScenariosList(false, { is_module_only: false }),
        plansStore.fetchPlansList(),
      ]).catch((error: unknown) => console.error("Error in setupOnloadMethods:", error))

      commonStore.setIsPageLoading(false)

      next()
    },

    redirect: {
      name: "platform.dashboard",
    },

    children: [
      {
        path: "/platform/conversation",
        name: "platform.conversation",
        component: async () => await import("@/pages").then((module) => module.ConversationPagePlatform),
      },
      {
        path: "/platform/dashboard",
        name: "platform.dashboard",
        component: async () => await import("@/pages").then((module) => module.ConversationDashboardPagePlatform),
      },
      {
        path: "/platform/history/:id?",
        name: "platform.history",
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
      {
        path: "/platform/vocabulary",
        name: "platform.vocabulary",
        component: async () => await import("@/pages").then((module) => module.VocabularyPagePlatform),
      },
    ],
  },
]

export default platform
