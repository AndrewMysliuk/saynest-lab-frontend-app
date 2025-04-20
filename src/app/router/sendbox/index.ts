import { RouteRecordRaw } from "vue-router"

const sendbox: RouteRecordRaw[] = [
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
]

export default sendbox
