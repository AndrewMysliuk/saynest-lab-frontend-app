import { RouteRecordRaw } from "vue-router"
import { authStore } from "@/app"
import AuthLayout from "@/layouts/AuthLayout.vue"
import { useTawk } from "@/shared/config"

const auth: RouteRecordRaw[] = [
  {
    path: "/auth",
    name: "auth",
    component: AuthLayout,
    beforeEnter: (_to, _from, next) => {
      const isLogged = authStore.getIsLogged

      // Tawk
      const { hide } = useTawk()
      hide()

      if (isLogged) {
        next({ name: "platform.dashboard" })
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

      {
        path: "/auth/signup",
        name: "auth.signup",
        component: async () => await import("@/pages").then((module) => module.SignupPageAuth),
      },
    ],
  },
]

export default auth
