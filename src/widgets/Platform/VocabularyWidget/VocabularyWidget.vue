<template>
  <div>
    <TheLoader v-if="getIsPageLoading" />

    <div class="pt-16" v-else>
      <div class="px-6 py-10">
        <h1 class="text-3xl font-bold text-text-base mb-6">Vocabulary</h1>

        <div v-if="getWordsList.length === 0" class="text-gray-500">No words yet</div>

        <ul class="space-y-2">
          <li
            v-for="word in getWordsList"
            :key="word._id"
            class="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition cursor-pointer"
            @click="handleWordClick(word?.global_word_entity?.word || '')"
          >
            <div class="grid grid-cols-6 gap-4 items-center">
              <div class="col-span-2">
                <div class="text-lg font-semibold text-gray-900">{{ word.global_word_entity.word }}</div>
                <div class="text-xs text-gray-500 capitalize">{{ word.global_word_entity.part_of_speech }}</div>
              </div>

              <div class="col-span-3">
                <div class="text-sm text-gray-700 italic">
                  {{ word.global_word_entity.senses?.[0]?.definitions?.[0] || "No definition" }}
                </div>
              </div>

              <div class="col-span-1 flex items-center gap-2 justify-end">
                <span v-if="word.tier" class="text-xs font-medium px-2 py-0.5 rounded" :class="tierColor[word.tier]">
                  {{ tierLabel[word.tier] }}
                </span>

                <span v-else class="text-xs text-gray-400">Tier: –</span>

                <i v-if="word.global_word_entity.audio_url" class="fas fa-volume-up text-gray-500 hover:text-black cursor-pointer" @click.stop="playAudio(word)"></i>
              </div>
            </div>
          </li>
        </ul>

        <div ref="loadMoreTrigger" class="h-1" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from "vue"
import { TheLoader } from "@/shared/components"
import { commonStore, userStore, vocabularyStore } from "@/app"
import { IUserWordPublic } from "@/shared/types"

export default defineComponent({
  components: {
    TheLoader,
  },

  setup() {
    const loadMoreTrigger = ref<HTMLElement | null>(null)
    const observer = ref<IntersectionObserver | null>(null)
    const tierColor: Record<number, string> = {
      1: "bg-red-100 text-red-700",
      2: "bg-yellow-100 text-yellow-700",
      3: "bg-blue-100 text-blue-700",
      4: "bg-green-100 text-green-700",
    }
    const tierLabel: Record<number, string> = {
      1: "New word",
      2: "Recognizable",
      3: "Understands in context",
      4: "Mastered",
    }

    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)
    const getWordsListParams = computed(() => vocabularyStore.getWordsListParams)
    const getWordsList = computed(() => vocabularyStore.getWordsList)
    const getUserTranslateLanguage = computed(() => userStore.getCurrentUser?.explanation_language || "en")

    onMounted(() => {
      observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && getWordsListParams.value.hasMore) {
          vocabularyStore.listUserWordsMethod(true)
        }
      })

      if (loadMoreTrigger.value) {
        observer.value.observe(loadMoreTrigger.value)
      }
    })

    const playAudio = async (word: IUserWordPublic) => {
      if (!word?.global_word_entity?.audio_url) return

      try {
        const audio = new Audio(word.global_word_entity.audio_url)
        await audio.play()
      } catch {
        await handleAudioError(word)
      }
    }

    const handleAudioError = async (word: IUserWordPublic) => {
      const wordId = word.global_word_entity?._id
      if (!wordId) return

      try {
        await vocabularyStore.generateWordAudioUrlMethod(wordId)
        const refreshed = vocabularyStore.getSelectedWord?.global_word_entity?.audio_url
        if (!refreshed) return

        const audio = new Audio(refreshed)
        await audio.play()
      } catch (err) {
        console.warn("Failed to refresh or play updated audio", err)
      }
    }

    const handleWordClick = async (word: string) => {
      if (!word) return

      try {
        vocabularyStore.setIsWordModalOpen(true)

        await vocabularyStore.lookupWordMethod({
          word,
          target_language: "en",
          native_language: getUserTranslateLanguage.value,
        })
      } catch (error: unknown) {
        vocabularyStore.setIsWordModalOpen(false)
      }
    }

    onBeforeUnmount(() => {
      observer.value?.disconnect()
      vocabularyStore.setIsWordModalOpen(false)
    })

    return {
      tierColor,
      tierLabel,
      loadMoreTrigger,
      getIsPageLoading,
      getWordsList,
      playAudio,
      handleWordClick,
    }
  },
})
</script>
