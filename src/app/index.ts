import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "@/app/router"
import { useSendboxStore, useRealtimeStore } from "@/shared/store"
import App from "./index.vue"
import "./index.scss"

import { components } from "@/shared/config"
import { createAudioPlayer } from "@/shared/lib"

export const app = createApp(App)

components.forEach((element) => {
  app.component(element.name as string, element)
})

app.use(createPinia())
app.use(router)

// Audio Player
export const audioPlayer = createAudioPlayer()

export const sendboxStore = useSendboxStore()
export const realtimeStore = useRealtimeStore()
