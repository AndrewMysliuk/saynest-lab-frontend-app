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
    path: "/session-review/:public_id",
    name: "session-review-public",
    component: () => import("@/pages").then((module) => module.SessionReview),
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
      name: "platform.dashboard",
    },

    beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      authStore.initializeAuthStore()

      next()
    },

    children: childrenComponents,
  },
]
