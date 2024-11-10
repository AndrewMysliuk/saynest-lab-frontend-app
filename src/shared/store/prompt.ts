import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IPrompt } from "@/shared/types"
import { ieltsTest1Prompt, psychologyConversation1Prompt, labourerConversation1Prompt, testPrompt } from "@/shared/utils"

export const usePromptStore = defineStore("promptStore", () => {
  const promptList = ref<IPrompt[]>([
    {
      id: 1,
      title: "IELTS Speaking 1 Prompt",
      description: "Lifelong Learning and Adult Development",
      prompt: ieltsTest1Prompt,
    },
    {
      id: 2,
      title: "Psychology Conversation 1 Prompt",
      prompt: psychologyConversation1Prompt,
    },
    {
      id: 3,
      title: "Labourer Conversation 1 Prompt",
      prompt: labourerConversation1Prompt,
    },
    {
      id: 4,
      title: "Test Prompt",
      prompt: testPrompt,
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
