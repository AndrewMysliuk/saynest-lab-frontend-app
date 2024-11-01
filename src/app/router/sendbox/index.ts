import { RouteRecordRaw } from "vue-router"

const sendbox: RouteRecordRaw[] = [
  {
    path: "/sendbox/whisper",
    name: "sendbox.whisper",
    component: async () => await import("@/pages").then((module) => module.ConversationSendboxPage),
  },
  {
    path: "/sendbox/prompts",
    name: "sendbox.prompts",
    component: async () => await import("@/pages").then((module) => module.PromptsSendboxPage),
  },
  {
    path: "/sendbox/room",
    name: "sendbox.room",
    component: async () => await import("@/pages").then((module) => module.RoomSendboxPage),
  },
]

export default sendbox
