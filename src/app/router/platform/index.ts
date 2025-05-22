import { RouteRecordRaw } from "vue-router"
import { authStore, userStore } from "@/app"
import PlatformLayout from "@/layouts/PlatformLayout.vue"

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

      if (!currentUser) {
        await userStore.fetchGetUser()
      }

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
    ],
  },
]

export default platform
