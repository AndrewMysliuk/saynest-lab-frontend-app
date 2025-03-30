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
    path: "/sendbox/scenario-dashboard",
    name: "sendbox.scenario-dashboard",
    component: async () => await import("@/pages").then((module) => module.ScenarioDashboardPageSendbox),
  },
  {
    path: "/sendbox/grammar-dashboard",
    name: "sendbox.grammar-dashboard",
    component: async () => await import("@/pages").then((module) => module.GrammarDashboardPageSendbox),
  },
]

export default sendbox
