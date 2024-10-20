import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "@/app/router"
import { useSendboxStore } from "@/shared/store"
import App from "./index.vue"
import "./index.scss"

export const app = createApp(App)

app.use(createPinia())
app.use(router)

export const sendboxStore = useSendboxStore()
