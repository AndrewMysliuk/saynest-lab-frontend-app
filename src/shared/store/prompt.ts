import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IPrompt } from "@/shared/types"
import { smallTalk1Prompt, smallTalk2Prompt, smallTalk3Prompt } from "@/shared/utils"

export const usePromptStore = defineStore("promptStore", () => {
  const promptList = ref<IPrompt[]>([
    {
      id: 1,
      title: "✂️ At the Hair Salon",
      description: `Practice casual English through small talk in a salon or barbershop setting.
        This prompt helps users learn how to describe haircuts, ask for styling preferences, and chat while getting their “just a little off the top.”
        Perfect for those who want to master phrases like "fade," "trim," and "don’t touch the bangs."`,
      prompt: smallTalk1Prompt,
    },

    {
      id: 2,
      title: "🍽 Ordering Like a Pro",
      description: `Improve your English skills while navigating a restaurant menu.
      This prompt guides users through realistic dialogues about choosing dishes, asking for recommendations, and sending back that undercooked chicken politely.
      Practice phrases like "I’ll have the...", "Can we split the check?", and “No onions, please.”`,
      prompt: smallTalk2Prompt,
    },

    {
      id: 3,
      title: "🌍 Travel Talk",
      description: `Make English part of your travel essentials.
        This prompt lets users simulate conversations about booking flights, planning itineraries, and getting lost in the friendliest way possible.
        You’ll pick up travel-specific vocabulary and handy expressions like “round-trip,” “check-in,” and “Do you have Wi-Fi?”`,
      prompt: smallTalk3Prompt,
    },
  ])
  const selectedPrompt = ref<IPrompt>({} as IPrompt)

  const getPromptList = computed(() => promptList.value)
  const getSelectedPrompt = computed(() => selectedPrompt.value)

  const setPrompt = (prompt: IPrompt) => {
    selectedPrompt.value = prompt
  }

  return {
    getPromptList,
    getSelectedPrompt,
    setPrompt,
  }
})
