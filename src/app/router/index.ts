import { createRouter, createWebHistory } from "vue-router"

import { routes } from "./router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  document.title = (to?.meta?.title as string) || "Saynest Lab"

  if (typeof window !== "undefined") {
    // GA4 pageview
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: "pageview",
      page_path: to.fullPath,
      page_title: document.title,
      page_location: window.location.href,
    })

    // Hotjar state change
    if (typeof window.hj === "function") {
      window.hj("stateChange", to.fullPath)
    }
  }
})

export default router
