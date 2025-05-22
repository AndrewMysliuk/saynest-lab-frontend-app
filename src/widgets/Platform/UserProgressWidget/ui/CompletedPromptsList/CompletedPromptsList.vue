<template>
  <div class="bg-white p-4 rounded-xl shadow flex-1">
    <h2 class="text-lg font-semibold mb-4">Most Completed Prompts</h2>

    <div v-if="sortedPrompts.length" class="space-y-2">
      <div v-for="(item, index) in sortedPrompts" :key="item.key" class="flex items-center justify-between px-4 py-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition">
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-stone-600">{{ index + 1 }}.</span>
          <span class="text-sm text-stone-800">{{ item.key }}</span>
        </div>
        <span class="text-sm text-stone-500">{{ item.value }}x</span>
      </div>
    </div>

    <div v-else class="text-gray-400 text-sm">No completed prompts yet. Pick something!</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { userProgressStore } from "@/app"

export default defineComponent({
  setup() {
    const completedPrompts = computed(() => userProgressStore.getCurrentUserProgress?.completed_prompts || {})
    const sortedPrompts = computed(() => {
      return Object.entries(completedPrompts.value)
        .sort(([, a], [, b]) => b - a)
        .map(([key, value]) => ({ key, value }))
    })

    return {
      sortedPrompts,
    }
  },
})
</script>
