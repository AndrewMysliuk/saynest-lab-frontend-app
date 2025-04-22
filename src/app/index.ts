import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "@/app/router"
import { useConversationStore, usePromptStore, useErrorAnalysisStore, useVocabularyTrackerStore, useCommunicationReviewStore, useTaskGeneratorStore } from "@/shared/store"
import { wordClickDirective } from "@/shared/directives"
import App from "./index.vue"
import "./index.scss"

import { components } from "@/shared/config"
import { createAudioPlayer } from "@/shared/lib"

export const app = createApp(App)

app.directive("word-click", wordClickDirective)

components.forEach((element) => {
  app.component(element.name as string, element)
})

app.use(createPinia())
app.use(router)

// Audio Player
export const audioPlayer = createAudioPlayer()
export const conversationStore = useConversationStore()
export const promptStore = usePromptStore()
export const errorAnalysisStore = useErrorAnalysisStore()
export const vocabularyTrackerStore = useVocabularyTrackerStore()
export const communicationReviewStore = useCommunicationReviewStore()
export const taskGeneratorStore = useTaskGeneratorStore()
