<template>
  <div class="bg-white p-4 rounded-xl shadow flex-1">
    <h2 class="text-lg font-semibold mb-4">Most Frequent Errors</h2>

    <div v-if="sortedErrors.length" class="space-y-2">
      <div v-for="(error, index) in sortedErrors" :key="error.category" class="flex items-center justify-between px-4 py-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition">
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-stone-600">{{ index + 1 }}.</span>
          <span class="text-sm text-stone-800 capitalize">{{ error.category }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-stone-600">{{ error.total_count }}x</span>
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
      </div>
    </div>

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

    const sortedErrors = computed(() => [...errorStats.value].sort((a, b) => b.total_count - a.total_count))

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
