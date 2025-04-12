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

  {
    path: "/sendbox/task-practice",
    name: "sendbox.task-practice",
    component: async () => await import("@/pages").then((module) => module.TaskPracticePageSendbox),
  },

  {
    path: "/sendbox/conversation-history",
    name: "sendbox.conversation-history",
    component: async () => await import("@/pages").then((module) => module.ConversationHistoryPageSendbox),
  },
]

export default sendbox
