<template>
  <div class="p-5 flex-1 bg-white border border-stone-200 shadow rounded-xl">
    <h2 class="text-base font-semibold text-gray-900 mb-4">Most Completed Prompts</h2>

    <ul v-if="sortedPrompts.length" class="divide-y divide-gray-100">
      <li v-for="(item, index) in sortedPrompts" :key="item.key" class="flex items-center justify-between py-2 px-1">
        <div class="flex items-start gap-3">
          <span class="text-sm font-medium text-gray-500 w-4 text-right">{{ index + 1 }}.</span>
          <span class="text-sm text-gray-800 leading-snug">{{ item.key.replace(/_/g, " ") }}</span>
        </div>
        <span class="text-sm text-gray-600">{{ item.value }}x</span>
      </li>
    </ul>

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
        .slice(0, 5)
    })

    return {
      sortedPrompts,
    }
  },
})
</script>
