<template>
  <div ref="textContainerRef" class="interactive-text" @mouseup="handleTextSelection">
    <template v-for="(word, _index) in tokenizedWords" :key="_index">
      <span
        class="word select-text cursor-pointer px-0.5 rounded selection:bg-yellow-300 selection:text-black"
        :class="['hover:bg-yellow-100', highlightColor(word)]"
        @click="() => handleWordClick(word)"
      >
        {{ word }}
      </span>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue"
import { normalizeTrim } from "@/shared/utils"
import { vocabularyStore } from "@/app"

export default defineComponent({
  props: {
    text: {
      type: String,
      default: "",
    },
  },

  setup(props, { emit }) {
    const textContainerRef = ref<HTMLDivElement | null>(null)
    const isSkipClick = ref<boolean>(false)

    const tokenizedWords = computed(() => props.text.split(/\s+/))
    const getSelectedWord = computed(() => vocabularyStore.getSelectedWord)
    const normalizedCurrentWord = computed(() => normalizeTrim(getSelectedWord.value?.global_word_entity?.word || "").toLowerCase())

    const highlightColor = (word: string) => {
      const current = getSelectedWord.value
      if (!current) return ""

      const normalized = normalizeTrim(word).toLowerCase()
      if (normalized !== normalizedCurrentWord.value) return ""

      const base = "underline underline-offset-2"

      if (current.tier === null) return base

      const color = {
        1: "bg-red-100",
        2: "bg-yellow-100",
        3: "bg-blue-100",
        4: "bg-green-100",
      }[current.tier]

      return `${color} ${base}`
    }

    const handleWordClick = (word: string) => {
      const selection = window.getSelection()
      const selectedText = selection?.toString().trim()

      if (selectedText && selectedText.length > 0 && selectedText !== word) {
        isSkipClick.value = true
        return
      }

      emit("click-word", normalizeTrim(word))
    }

    const handleTextSelection = () => {
      if (isSkipClick.value) {
        isSkipClick.value = false
        return
      }

      const selection = window.getSelection()
      if (!selection || selection.isCollapsed) return

      const range = selection.getRangeAt(0)
      const container = textContainerRef.value
      if (!container) return

      const wordSpans = Array.from(container.querySelectorAll("span.word")) as HTMLElement[]

      const selectedWords = wordSpans.filter((span) => {
        const spanRange = document.createRange()
        spanRange.selectNodeContents(span)
        return range.intersectsNode(span)
      })

      if (selectedWords.length > 1) {
        const phrase = selectedWords.map((el) => normalizeTrim(el.textContent || "")).join(" ")
        emit("select-text", phrase)
      }
    }

    return {
      textContainerRef,
      tokenizedWords,
      highlightColor,
      handleWordClick,
      handleTextSelection,
    }
  },
})
</script>

<style lang="scss" scoped>
.word::after {
  content: " ";
}
</style>
