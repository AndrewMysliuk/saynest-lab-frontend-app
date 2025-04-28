import { RouteRecordRaw } from "vue-router"
import { authStore } from "@/app"
import AuthLayout from "@/layouts/AuthLayout.vue"

const auth: RouteRecordRaw[] = [
  {
    path: "/auth",
    name: "auth",
    component: AuthLayout,
    beforeEnter: (_to, _from, next) => {
      const isLogged = authStore.getIsLogged

      if (isLogged) {
        next({ name: "sendbox.conversation-dashboard" })
        return
      }

      next()
    },

    redirect: {
      name: "auth.login",
    },

    children: [
      {
        path: "/auth/login",
        name: "auth.login",
        component: async () => await import("@/pages").then((module) => module.LoginPageAuth),
      },
    ],
  },
]

export default auth
