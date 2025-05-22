<template>
  <div class="bg-white p-4 rounded-xl shadow flex-1">
    <h2 class="text-lg font-semibold mb-4">Filler Words Usage</h2>

    <div v-if="sortedFillerWords.length" class="space-y-2">
      <div v-for="(word, index) in sortedFillerWords" :key="word.word" class="flex items-center justify-between px-4 py-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition">
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-stone-600">{{ index + 1 }}.</span>
          <span class="text-sm text-stone-800">“{{ word.word }}”</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-stone-600">{{ word.total_count }}x</span>
          <span
            :class="{
              'text-red-500': word.trend === 'UP',
              'text-green-500': word.trend === 'DOWN',
              'text-gray-400': word.trend === 'STABLE',
            }"
          >
            {{ trendEmoji[word.trend] }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-400 text-sm">No filler words detected. You're a linguistic ninja.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { userProgressStore } from "@/app"
import type { IUserProgressFillerWordsUsage } from "@/shared/types"

export default defineComponent({
  setup() {
    const fillerWords = computed<IUserProgressFillerWordsUsage[]>(() => userProgressStore.getCurrentUserProgress?.filler_words_usage || [])

    const sortedFillerWords = computed(() => [...fillerWords.value].sort((a, b) => b.total_count - a.total_count))

    const trendEmoji = {
      UP: "🔺",
      DOWN: "🔻",
      STABLE: "⏸️",
    }

    return {
      sortedFillerWords,
      trendEmoji,
    }
  },
})
</script>
