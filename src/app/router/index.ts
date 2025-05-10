import { createRouter, createWebHistory } from "vue-router"

import { routes } from "./router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  document.title = (to?.meta?.title as string) || "OpenAI Speak Mate Frontend"

  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: "pageview",
      page_path: to.fullPath,
      page_title: document.title,
    })
  }
})

export default router
