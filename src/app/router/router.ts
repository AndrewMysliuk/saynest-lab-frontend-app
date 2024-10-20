import { RouteRecordRaw } from "vue-router"

import MainLayout from "@/layouts/MainLayout.vue"

// Routers
const childrenComponents = [
  {
    path: "/sendbox/whisper",
    name: "sendbox.whisper",
    component: async () => await import("@/pages").then((module) => module.WhisperSendboxPage),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
]

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "index",
    component: MainLayout,

    redirect: {
      name: "sendbox.whisper",
    },

    // beforeEnter: async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {},

    children: childrenComponents,
  },
]
