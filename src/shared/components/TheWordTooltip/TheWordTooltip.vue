<template>
  <transition name="fade">
    <div v-if="isVisible" class="tooltip-word" :class="{ '--loading': isLoading }" :style="style" @mouseover="cancelHide" @mouseout="onMouseOut">
      <div v-if="!isLoading">
        <div class="tooltip-word__header">
          <span class="tooltip-word__word">{{ word }}</span>
          <span class="tooltip-word__icons">
            <i class="tooltip-word__icon fas fa-volume-up" title="Проиграть" @click.stop="fetchWordAudio" />
            <i class="tooltip-word__icon fas fa-copy" title="Копировать" @click.stop="copyWord" />
          </span>
        </div>

        <div class="tooltip-word__body" v-if="getCurrentWord">
          <div v-for="meaning in getCurrentWord.meanings" :key="meaning.meaning" class="tooltip-word__meaning">
            <div class="tooltip-word__pos">{{ meaning.part_of_speech }}</div>
            <div class="tooltip-word__translation">{{ meaning.translation }}</div>
            <div class="tooltip-word__description">{{ meaning.meaning }}</div>
            <div v-if="meaning.synonyms.length" class="tooltip-word__synonyms"><strong>Synonyms:</strong> {{ meaning.synonyms.join(", ") }}</div>
          </div>
        </div>
      </div>

      <div v-else>Loading...</div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeUnmount, PropType, CSSProperties, computed } from "vue"
import { ITooltipPosition } from "@/shared/types"
import { vocabularyTrackerStore } from "@/app"

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
          word: props.word,
          language: props.language,
          translation_language: props.translationLanguage,
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
          word: props.word,
          language: props.language,
          translation_language: props.translationLanguage,
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

<style lang="scss" src="./TheWordTooltip.scss" />
