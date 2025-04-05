<template>
  <div class="dashboard">
    <h1>Prompts</h1>

    <div class="dashboard__wrapper">
      <div class="dashboard__card" v-for="prompt in getPromptList" :key="prompt.id" @click="selectPrompt(prompt)">
        <h3 class="dashboard__card-title">{{ prompt?.title }}</h3>

        <br />

        <p class="dashboard__card-description">{{ prompt.description }}</p>
      </div>
    </div>

    <br /><br /><br />

    <div v-word-click="handleWordClick">Здравейте, как сте? Това е тестов абзац без всяких span'ов и цирков.</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeMount } from "vue"
import { useRouter } from "vue-router"
import { promptStore, vocabularyTrackerStore } from "@/app"
import { IPrompt } from "@/shared/types"

export default defineComponent({
  setup() {
    const router = useRouter()

    const getPromptList = computed(() => promptStore.getPromptList)
    const getWordsList = computed(() => vocabularyTrackerStore.getWordsList)
    const getCurrentWord = computed(() => vocabularyTrackerStore.getCurrentWord)

    onBeforeMount(async () => {
      await vocabularyTrackerStore.fetchWordsList()

      console.log("getWordsList: ", getWordsList.value)
    })

    const selectPrompt = (prompt: IPrompt) => {
      promptStore.setPrompt(prompt)

      nextTick(() => {
        router.push({ name: "sendbox.conversation" })
      })
    }

    const handleWordClick = async (word: string) => {
      try {
        await vocabularyTrackerStore.fetchWordExplanation({
          word,
          language: "bg",
          translation_language: "uk",
        })

        await vocabularyTrackerStore.fetchWordAudio({
          word,
          language: "bg",
          translation_language: "uk",
        })

        console.log("getCurrentWord: ", getCurrentWord.value)

        if (getCurrentWord.value && getCurrentWord.value.audio_base64) {
          playBase64Audio(getCurrentWord.value?.audio_base64)
        }
      } catch (error: unknown) {
        console.log(error)
      }
    }

    function playBase64Audio(base64Audio: string) {
      const audio = new Audio()
      audio.src = base64Audio
      audio.load()
      audio.play().catch((err) => {
        console.error("Playback error:", err)
      })
    }

    return {
      getPromptList,
      getCurrentWord,
      selectPrompt,
      handleWordClick,
    }
  },
})
</script>
