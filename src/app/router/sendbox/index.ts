import { RouteRecordRaw } from "vue-router"

const sendbox: RouteRecordRaw[] = [
  {
    path: "/sendbox/conversation",
    name: "sendbox.conversation",
    component: async () => await import("@/pages").then((module) => module.ConversationSendboxPage),
  },
  {
    path: "/sendbox/prompts",
    name: "sendbox.prompts",
    component: async () => await import("@/pages").then((module) => module.PromptsSendboxPage),
  },
  {
    path: "/sendbox/analyser",
    name: "sendbox.analyser",
    component: async () => await import("@/pages").then((module) => module.AnalyserSendboxPage),
  },

  // DEPRECATED OPENAI REALTIME API VERSION
  // {
  //   path: "/sendbox/room",
  //   name: "sendbox.room",
  //   component: async () => await import("@/pages").then((module) => module.RoomSendboxPage),
  // },
  // {
  //   path: "/sendbox/tasks",
  //   name: "sendbox.tasks",
  //   component: async () => await import("@/pages").then((module) => module.TasksSendboxPage),
  // },
]

export default sendbox
