import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from "vue-router"
import MainLayout from "@/layouts/MainLayout.vue"
import platform from "./platform"
import auth from "./auth"
import { authStore } from ".."

// Routers
const childrenComponents: RouteRecordRaw[] = [
  ...auth,
  ...platform,
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
      name: "platform.conversation-dashboard",
    },

    beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      authStore.initializeAuthStore()

      next()
    },

    children: childrenComponents,
  },
]
