import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "@/app/router"
import { useSendboxStore } from "@/shared/store"
import App from "./index.vue"
import "./index.scss"

import { components } from "@/shared/config"

export const app = createApp(App)

components.forEach((element) => {
  app.component(element.name as string, element)
})

app.use(createPinia())
app.use(router)

export const sendboxStore = useSendboxStore()
