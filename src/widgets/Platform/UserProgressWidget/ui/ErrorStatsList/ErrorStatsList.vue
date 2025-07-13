<template>
  <div class="p-5 flex-1 bg-white border border-stone-200 shadow rounded-xl">
    <h2 class="text-base font-semibold text-gray-900 mb-4">Most Frequent Errors</h2>

    <ul v-if="sortedErrors.length" class="divide-y divide-gray-100">
      <li v-for="(error, index) in sortedErrors" :key="error.category" class="flex items-center justify-between py-2 px-1">
        <div class="flex items-start gap-3">
          <span class="text-sm font-medium text-gray-500 w-4 text-right">{{ index + 1 }}.</span>
          <span class="text-sm text-gray-800 leading-snug">{{ error.category }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-gray-600">{{ error.total_count }}x</span>
          <span
            :class="{
              'text-red-500': error.trend === 'UP',
              'text-green-500': error.trend === 'DOWN',
              'text-gray-400': error.trend === 'STABLE',
            }"
          >
            {{ trendEmoji[error.trend] }}
          </span>
        </div>
      </li>
    </ul>

    <div v-else class="text-gray-400 text-sm">No errors found. Are you... perfect?</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { userProgressStore } from "@/app"
import type { IUserProgressErrorStats } from "@/shared/types"

export default defineComponent({
  setup() {
    const errorStats = computed<IUserProgressErrorStats[]>(() => userProgressStore.getCurrentUserProgress?.error_stats || [])

    const sortedErrors = computed(() => [...errorStats.value].sort((a, b) => b.total_count - a.total_count).slice(0, 5))

    const trendEmoji = {
      UP: "🔺",
      DOWN: "🔻",
      STABLE: "⏸️",
    }

    return {
      sortedErrors,
      trendEmoji,
    }
  },
})
</script>
