import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "@/app/router"
import { useConversationStore, usePromptStore, useTaskGeneratorStore, useScenarioSimulationStore, useLanguageTheoryStore, useErrorAnalysisStore, useVocabularyTrackerStore } from "@/shared/store"
import { animateTextDirective, wordClickDirective } from "@/shared/directives"
import App from "./index.vue"
import "./index.scss"

import { components } from "@/shared/config"
import { createAudioPlayer } from "@/shared/lib"

export const app = createApp(App)

app.directive("animate-text", animateTextDirective)
app.directive("word-click", wordClickDirective)

components.forEach((element) => {
  app.component(element.name as string, element)
})

app.use(createPinia())
app.use(router)

// Audio Player
export const audioPlayer = createAudioPlayer()
export const conversationStore = useConversationStore()
export const taskGeneratorStore = useTaskGeneratorStore()
export const scenarioSimulationStore = useScenarioSimulationStore()
export const languageTheoryStore = useLanguageTheoryStore()
export const promptStore = usePromptStore()
export const errorAnalysisStore = useErrorAnalysisStore()
export const vocabularyTrackerStore = useVocabularyTrackerStore()
