<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center">
      <span class="text-gray-500 text-sm mb-1">Finished Sessions</span>
      <span class="text-2xl font-semibold">
        {{ totalSessions }}
      </span>
    </div>
    <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center">
      <span class="text-gray-500 text-sm mb-1">Avg Session Duration</span>
      <span class="text-2xl font-semibold"> {{ avgDuration }} </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { userProgressStore } from "@/app"
import { formatDuration } from "@/shared/lib"

export default defineComponent({
  setup() {
    const userProgress = computed(() => userProgressStore.getCurrentUserProgress)
    const totalSessions = computed(() => userProgress.value?.total_sessions ?? 0)
    const avgDuration = computed(() => formatDuration(userProgress.value?.avg_session_duration ?? 0))

    return {
      totalSessions,
      avgDuration,
    }
  },
})
</script>
