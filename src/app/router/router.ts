import { RouteRecordRaw } from "vue-router"
import MainLayout from "@/layouts/MainLayout.vue"
import sendbox from "./sendbox"

// Routers
const childrenComponents: RouteRecordRaw[] = [
  ...sendbox,
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
      name: "sendbox.conversation-dashboard",
    },

    // beforeEnter: async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {},

    children: childrenComponents,
  },
]
