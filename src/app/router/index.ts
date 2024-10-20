import { createRouter, createWebHistory } from "vue-router"

import { routes } from "./router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  document.title = (to?.meta?.title as string) || "OpenAI Speak Mate Frontend"
})

export default router
