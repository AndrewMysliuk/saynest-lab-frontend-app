import { RouteRecordRaw } from "vue-router"
import { authStore } from "@/app"
import PlatformLayout from "@/layouts/PlatformLayout.vue"

const sendbox: RouteRecordRaw[] = [
  {
    path: "/sendbox",
    name: "sendbox",
    component: PlatformLayout,
    beforeEnter: (_to, _from, next) => {
      const isLogged = authStore.getIsLogged

      if (!isLogged) {
        next({ name: "auth.login" })
        return
      }

      next()
    },

    redirect: {
      name: "sendbox.conversation-dashboard",
    },

    children: [
      {
        path: "/sendbox/conversation",
        name: "sendbox.conversation",
        component: async () => await import("@/pages").then((module) => module.ConversationPageSendbox),
      },
      {
        path: "/sendbox/conversation-dashboard",
        name: "sendbox.conversation-dashboard",
        component: async () => await import("@/pages").then((module) => module.ConversationDashboardPageSendbox),
      },
      {
        path: "/sendbox/conversation-history/:id?",
        name: "sendbox.conversation-history",
        component: async () => await import("@/pages").then((module) => module.ConversationHistoryPageSendbox),
      },
    ],
  },
]

export default sendbox
