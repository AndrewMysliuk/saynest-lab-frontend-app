<template>
  <transition name="fade">
    <div v-if="isVisible" :style="style" class="absolute z-50 max-w-xs bg-zinc-900 text-white rounded-xl shadow-xl p-4 text-sm" @mouseover="cancelHide" @mouseout="onMouseOut">
      <div v-if="!isLoading">
        <!-- Header -->
        <div class="flex items-start justify-between mb-2">
          <span class="text-base font-semibold">{{ word }}</span>
          <div class="flex items-center gap-3">
            <button @click.stop="fetchWordAudio" title="Play" class="text-white hover:text-primary">
              <i class="fas fa-volume-up text-base" />
            </button>
            <button @click.stop="copyWord" title="Copy" class="text-white hover:text-primary">
              <i class="fas fa-copy text-base" />
            </button>
          </div>
        </div>

        <!-- Meanings -->
        <div v-if="getCurrentWord" class="space-y-4">
          <div v-for="(meaning, index) in getCurrentWord.meanings" :key="index" class="border-t border-white/10 pt-2 first:border-none first:pt-0">
            <div class="italic text-sky-400 mb-0.5">{{ meaning.part_of_speech }}</div>
            <div class="text-yellow-400 font-medium">{{ meaning.translation }}</div>
            <div class="text-white/80 mt-1">{{ meaning.meaning }}</div>
            <div v-if="meaning.synonyms?.length" class="mt-1 text-white/60"><span class="font-semibold text-white">Synonyms:</span> {{ meaning.synonyms.join(", ") }}</div>
          </div>
        </div>
      </div>

      <div v-else class="text-white/70">Loading...</div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeUnmount, PropType, CSSProperties, computed } from "vue"
import { ITooltipPosition } from "@/shared/types"
import { conversationStore, vocabularyTrackerStore } from "@/app"

export default defineComponent({
  props: {
    position: {
      type: Object as PropType<ITooltipPosition>,
      required: true,
    },

    show: {
      type: Boolean,
      required: true,
    },

    word: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    translationLanguage: {
      type: String,
      required: true,
    },
  },

  setup(props, { emit }) {
    const isVisible = ref<boolean>(false)
    const isLoading = ref<boolean>(false)
    const hideTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
    const style = ref<CSSProperties>({
      top: "0px",
      left: "0px",
      position: "absolute",
    })

    const getCurrentWord = computed(() => vocabularyTrackerStore.getCurrentWord)
    const getConversationResponse = computed(() => conversationStore.getConversationResponse)

    const cancelHide = () => {
      if (hideTimeout.value) {
        clearTimeout(hideTimeout.value)
        hideTimeout.value = null
      }
    }

    const scheduleHide = () => {
      cancelHide()
      hideTimeout.value = setTimeout(() => {
        isVisible.value = false
        emit("close")
      }, 500)
    }

    const onMouseOut = (event: MouseEvent) => {
      const target = event.currentTarget as Node
      const related = event.relatedTarget as Node | null

      if (!target || !related || !target.contains(related)) {
        scheduleHide()
      }
    }

    const fetchWordAudio = async () => {
      try {
        await vocabularyTrackerStore.fetchWordAudio({
          session_id: getConversationResponse.value?.session_id ?? "",
          word: props.word,
          target_language: props.language,
          explanation_language: props.translationLanguage,
        })

        if (getCurrentWord.value && getCurrentWord.value.audio_base64) {
          playBase64Audio(getCurrentWord.value?.audio_base64)
        }
      } catch (error: unknown) {
        console.log(error)
      }
    }

    const fetchWordExplanation = async () => {
      try {
        isLoading.value = true

        await vocabularyTrackerStore.fetchWordExplanation({
          session_id: getConversationResponse.value?.session_id ?? "",
          word: props.word,
          target_language: props.language,
          explanation_language: props.translationLanguage,
        })
      } catch (error: unknown) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    const copyWord = async () => {
      try {
        await navigator.clipboard.writeText(props.word)
      } catch (err) {
        console.error("Clipboard error:", err)
      }
    }

    const playBase64Audio = (base64Audio: string) => {
      const audio = new Audio()
      audio.src = base64Audio
      audio.load()
      audio.play().catch((err) => {
        console.error("Playback error:", err)
      })
    }

    watch(
      () => props.show,
      (newVal) => {
        isVisible.value = newVal
        if (newVal && props.position) {
          style.value = {
            top: `${props.position.y}px`,
            left: `${props.position.x}px`,
            position: "absolute",
          }
          fetchWordExplanation()
        }
      }
    )

    onBeforeUnmount(() => {
      cancelHide()
    })

    return {
      isLoading,
      isVisible,
      style,
      getCurrentWord,
      fetchWordAudio,
      copyWord,
      cancelHide,
      onMouseOut,
    }
  },
})
</script>

<!-- <style lang="scss" src="./TheWordTooltip.scss" /> -->
