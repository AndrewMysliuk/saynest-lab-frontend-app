import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IPrompt } from "@/shared/types"
import { smallTalk1Prompt } from "@/shared/utils"

export const usePromptStore = defineStore("promptStore", () => {
  const promptList = ref<IPrompt[]>([
    // {
    //   id: 1,
    //   title: "IELTS Speaking 1 Prompt",
    //   description: "Lifelong Learning and Adult Development",
    //   prompt: ieltsTest1Prompt,
    // },
    // {
    //   id: 2,
    //   title: "Psychology Conversation 1 Prompt",
    //   prompt: psychologyConversation1Prompt,
    // },
    // {
    //   id: 3,
    //   title: "Labourer Conversation 1 Prompt",
    //   prompt: labourerConversation1Prompt,
    // },
    {
      id: 4,
      title: "Small Talk Prompt",
      description:
        "This AI is designed to engage users in a relaxed, supportive, and insightful conversation to enhance their English communication skills. It initiates each interaction by asking about the user's language goals, interests, or areas they would like to practice.",
      prompt: smallTalk1Prompt,
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
