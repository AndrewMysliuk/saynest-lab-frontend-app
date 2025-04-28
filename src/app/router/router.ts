import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from "vue-router"
import MainLayout from "@/layouts/MainLayout.vue"
import sendbox from "./sendbox"
import auth from "./auth"
import { authStore } from ".."

// Routers
const childrenComponents: RouteRecordRaw[] = [
  ...auth,
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

    beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      authStore.initializeAuthStore()

      next()
    },

    children: childrenComponents,
  },
]
