<template>
  <div class="w-full h-screen bg-white border-l border-gray-200 shadow-md flex flex-col">
    <TheLoader v-if="!getSelectedWord && !getSelectedPhrase" is-absolute />

    <div v-else class="p-4 space-y-4 overflow-y-auto flex-1 pb-32">
      <div class="flex justify-end p-2">
        <i class="fas fa-times text-2xl text-gray-500 hover:text-gray-800 cursor-pointer" @click="closeModal"></i>
      </div>

      <div v-if="getSelectedPhrase">
        <h2 class="text-xl font-bold text-text-base">{{ getSelectedPhrase }}</h2>

        <div class="flex items-center gap-4 flex-wrap mt-4">
          <a :href="googleTranslatePhraseUrl" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded border border-blue-500 text-blue-600 text-sm hover:bg-blue-50 transition">
            Open in Google Translate
          </a>
          <a :href="deepLPhraseUrl" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded border border-purple-500 text-purple-600 text-sm hover:bg-purple-50 transition">
            Open in DeepL
          </a>
        </div>
      </div>

      <template v-if="getSelectedWord">
        <div class="flex items-center space-x-2">
          <h2 class="text-xl font-bold text-text-base">
            {{ getSelectedWord.global_word_entity.word }}
          </h2>

          <i class="fas fa-volume-up text-lg cursor-pointer text-gray-600 hover:text-black" @click="playAudio"></i>

          <audio ref="audioRef" v-if="getSelectedWord.global_word_entity.audio_url" :src="getSelectedWord.global_word_entity.audio_url" controls class="hidden" @error="handleAudioError" />
        </div>

        <div class="text-sm text-gray-600 italic">
          {{ getSelectedWord.global_word_entity.part_of_speech }}
        </div>

        <div class="flex items-center gap-4 flex-wrap mt-2">
          <a :href="googleTranslateUrl" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded border border-blue-500 text-blue-600 text-sm hover:bg-blue-50 transition">
            Open in Google Translate
          </a>

          <a :href="deepLUrl" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded border border-purple-500 text-purple-600 text-sm hover:bg-purple-50 transition"> Open in DeepL </a>
        </div>

        <div v-if="getSelectedWord.global_word_entity.senses?.length" class="space-y-4">
          <div v-for="(sense, idx) in getSelectedWord.global_word_entity.senses" :key="idx" class="bg-gray-50 p-4 rounded border space-y-3">
            <div v-if="sense.translations?.length">
              <div class="text-sm font-semibold text-gray-800">Translation</div>
              <div class="text-sm text-gray-700 ml-2">{{ sense.translations.join(", ") }}</div>
            </div>

            <div v-if="sense.definitions?.length">
              <div class="text-sm font-semibold text-gray-800">Definition</div>
              <div class="text-sm text-gray-700 ml-2">{{ sense.definitions.join("; ") }}</div>
            </div>

            <div v-if="sense.synonyms?.length">
              <div class="text-sm font-semibold text-gray-800">Synonyms</div>
              <div class="text-sm text-gray-700 ml-2">{{ sense.synonyms.join(", ") }}</div>
            </div>
          </div>
        </div>

        <div v-else class="text-sm text-gray-600 italic">No data available. Try using Google Translate or DeepL below.</div>

        <div v-else class="text-sm text-gray-600 italic">No data available. Try using Google Translate or DeepL above.</div>

        <div class="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]">
          <strong>{{
            getSelectedWord.tier !== null
              ? {
                  1: "You've just encountered this word.",
                  2: "It sounds familiar, but you're unsure.",
                  3: "You understand it in context but don't use it.",
                  4: "You fully understand and confidently use this word.",
                }[getSelectedWord.tier]
              : "This word is not yet in your vocabulary."
          }}</strong>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="(label, key) in tierButtons"
              :key="key"
              @click="handleTierChange(Number(key))"
              class="flex-1 px-3 py-2 rounded border text-sm text-center transition"
              :class="getSelectedWord.tier === Number(key) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
            >
              {{ label }}
            </button>

            <button v-if="getSelectedWord?.user_id" @click="deleteWord" class="flex-1 px-3 py-2 rounded border border-red-500 text-red-500 text-sm text-center hover:bg-red-50">Remove</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref } from "vue"
import { promptStore, userStore, vocabularyStore } from "@/app"
import { IUserWordTierEnum } from "@/shared/types"
import TheLoader from "../TheLoader"

export default defineComponent({
  components: {
    TheLoader,
  },

  setup() {
    const audioRef = ref<HTMLAudioElement | null>(null)
    const isLoading = ref<boolean>(false)

    const tierButtons: Record<number, string> = {
      [IUserWordTierEnum.UNKNOWN]: "1",
      [IUserWordTierEnum.RECOGNIZABLE]: "2",
      [IUserWordTierEnum.CONTEXTUAL]: "3",
      [IUserWordTierEnum.MASTERED]: "4",
    }

    const getSelectedWord = computed(() => vocabularyStore.getSelectedWord)
    const getSelectedPhrase = computed(() => vocabularyStore.getSelectedPhrase)
    const getSelectedPrompt = computed(() => promptStore.getCurrentPrompt)
    const getUserTranslateLanguage = computed(() => userStore.getCurrentUser?.explanation_language || "en")
    const encode = (txt: string) => encodeURIComponent(txt)
    const googleTranslateUrl = computed(() => {
      const word = getSelectedWord.value?.global_word_entity.word ?? ""
      const sl = getSelectedWord.value?.global_word_entity.target_language ?? "en"
      const tl = getSelectedWord.value?.global_word_entity.native_language ?? "en"

      return `https://translate.google.com/?sl=${sl}&tl=${tl}&text=${encode(word)}&op=translate`
    })
    const deepLUrl = computed(() => {
      const word = getSelectedWord.value?.global_word_entity.word ?? ""
      const sl = getSelectedWord.value?.global_word_entity.target_language ?? "en"
      const tl = getSelectedWord.value?.global_word_entity.native_language ?? "en"

      return `https://www.deepl.com/translator#${sl}/${tl}/${encode(word)}`
    })
    const googleTranslatePhraseUrl = computed(() => {
      const text = getSelectedPhrase.value || ""
      const sl = getSelectedPrompt.value.meta.target_language
      const tl = getUserTranslateLanguage.value
      return `https://translate.google.com/?sl=${sl}&tl=${tl}&text=${encode(text)}&op=translate`
    })

    const deepLPhraseUrl = computed(() => {
      const text = getSelectedPhrase.value || ""
      const sl = getSelectedPrompt.value.meta.target_language
      const tl = getUserTranslateLanguage.value
      return `https://www.deepl.com/translator#${sl}/${tl}/${encode(text)}`
    })

    const playAudio = () => {
      if (audioRef.value) {
        audioRef.value.currentTime = 0
        audioRef.value.play().catch((err) => {
          console.warn("Failed to play audio", err)
        })
      }
    }

    const handleAudioError = async (e: Event) => {
      const target = e.target as HTMLAudioElement
      const is403 = target?.error?.code === target?.error?.MEDIA_ERR_SRC_NOT_SUPPORTED

      if (is403 && getSelectedWord.value && getSelectedWord.value.global_word_entity?._id) {
        try {
          await vocabularyStore.generateWordAudioUrlMethod(getSelectedWord.value.global_word_entity._id)

          nextTick(() => {
            target.load()
            target.play().catch((err) => {
              console.warn("Auto-play blocked or failed:", err)
            })
          })
        } catch (err) {
          console.error("Failed to refresh audio URL", err)
        }
      }
    }

    const closeModal = () => {
      vocabularyStore.setSelectedWord(null)
      vocabularyStore.setSelectedPhrase("")
      vocabularyStore.setIsWordModalOpen(false)
    }

    const handleTierChange = async (value: number) => {
      if (isLoading.value) return

      const isUserHasWord = getSelectedWord.value?.user_id

      try {
        isLoading.value = true

        if (isUserHasWord) {
          await vocabularyStore.updateUserWordTierMethod({
            user_word_id: getSelectedWord.value?._id || "",
            tier: value,
          })
          return
        }

        await vocabularyStore.addWordToUserMethod({
          global_word_id: getSelectedWord.value?.global_word_entity?._id || "",
          tier: value,
        })
      } catch (error: unknown) {
        console.log(error)
      } finally {
        isLoading.value = false
        closeModal()
      }
    }

    const deleteWord = async () => {
      if (isLoading.value || !getSelectedWord.value?.user_id) return

      try {
        isLoading.value = true

        await vocabularyStore.deleteUserWordMethod(getSelectedWord.value?.global_word_entity?._id || "")
      } catch (error: unknown) {
        console.log(error)
      } finally {
        isLoading.value = false
        closeModal()
      }
    }

    return {
      audioRef,
      tierButtons,
      getSelectedWord,
      getSelectedPhrase,
      googleTranslateUrl,
      deepLUrl,
      googleTranslatePhraseUrl,
      deepLPhraseUrl,
      handleAudioError,
      playAudio,
      handleTierChange,
      closeModal,
      deleteWord,
    }
  },
})
</script>
