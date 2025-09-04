import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "@/app/router"
import {
  useConversationStore,
  usePromptStore,
  useErrorAnalysisStore,
  useVocabularyStore,
  useCommunicationReviewStore,
  useTaskGeneratorStore,
  useAuthStore,
  useUserStore,
  useOrgStore,
  useUserProgressStore,
  useCommonStore,
  usePlansStore,
  useSubscriptionStore,
  useWorkshopStore,
} from "@/shared/store"
import directives from "@/shared/directives"
import App from "./index.vue"
import "./index.scss"

import { components, gtmConfig, i18n } from "@/shared/config"
import { createAudioPlayer, createUrlAudioPlayer } from "@/shared/lib"
import { createGtm } from "@gtm-support/vue-gtm"

export const app = createApp(App)

app.use(
  createGtm({
    id: gtmConfig.id,
    enabled: gtmConfig.enabled,
    debug: false,
    vueRouter: router,
  })
)
directives(app)

components.forEach((element) => {
  app.component(element.name as string, element)
})

app.use(i18n)
app.use(createPinia())
app.use(router)

// Audio Player
export const audioPlayer = createAudioPlayer()
export const urlAudioPlayer = createUrlAudioPlayer()

// Storages
export const conversationStore = useConversationStore()
export const promptStore = usePromptStore()
export const errorAnalysisStore = useErrorAnalysisStore()
export const vocabularyStore = useVocabularyStore()
export const communicationReviewStore = useCommunicationReviewStore()
export const taskGeneratorStore = useTaskGeneratorStore()
export const authStore = useAuthStore()
export const userStore = useUserStore()
export const userProgressStore = useUserProgressStore()
export const commonStore = useCommonStore()
export const orgStore = useOrgStore()
export const plansStore = usePlansStore()
export const subscriptionStore = useSubscriptionStore()
export const workshopStore = useWorkshopStore()
