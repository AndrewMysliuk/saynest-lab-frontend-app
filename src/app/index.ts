import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "@/app/router"
import {
  useConversationStore,
  usePromptStore,
  useErrorAnalysisStore,
  useVocabularyTrackerStore,
  useCommunicationReviewStore,
  useTaskGeneratorStore,
  useAuthStore,
  useUserStore,
  useOrgStore,
  useUserProgressStore,
  useCommonStore,
  usePlansStore,
  useSubscriptionStore,
} from "@/shared/store"
import { wordClickDirective } from "@/shared/directives"
import App from "./index.vue"
import "./index.scss"

import { components, gtmConfig } from "@/shared/config"
import { createAudioPlayer, createUrlAudioPlayer } from "@/shared/lib"
import { createGtm } from "@gtm-support/vue-gtm"

export const app = createApp(App)

app.use(
  createGtm({
    id: gtmConfig.id,
    enabled: gtmConfig.enabled,
    debug: gtmConfig.debug,
    vueRouter: router,
  })
)

app.directive("word-click", wordClickDirective)

components.forEach((element) => {
  app.component(element.name as string, element)
})

app.use(createPinia())
app.use(router)

// Audio Player
export const audioPlayer = createAudioPlayer()
export const urlAudioPlayer = createUrlAudioPlayer()

// Storages
export const conversationStore = useConversationStore()
export const promptStore = usePromptStore()
export const errorAnalysisStore = useErrorAnalysisStore()
export const vocabularyTrackerStore = useVocabularyTrackerStore()
export const communicationReviewStore = useCommunicationReviewStore()
export const taskGeneratorStore = useTaskGeneratorStore()
export const authStore = useAuthStore()
export const userStore = useUserStore()
export const userProgressStore = useUserProgressStore()
export const commonStore = useCommonStore()
export const orgStore = useOrgStore()
export const plansStore = usePlansStore()
export const subscriptionStore = useSubscriptionStore()
