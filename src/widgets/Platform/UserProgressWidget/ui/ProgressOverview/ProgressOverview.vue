<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <!-- Card -->
    <div class="p-5 flex flex-col bg-white border border-stone-200 shadow-sm rounded-xl">
      <div class="flex gap-x-3">
        <div class="grow">
          <h2 class="text-sm md:text-base text-gray-600 font-medium">{{ t("progress.overview.finishedSessions.title") }}</h2>
          <p class="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">{{ totalSessions }}</p>
        </div>
        <svg
          class="shrink-0 size-6 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 12A10 10 0 1 1 12 2" />
          <path d="M22 2 12 12" />
          <path d="M16 2h6v6" />
        </svg>
      </div>
    </div>
    <!-- End Card -->

    <!-- Card -->
    <div class="p-5 flex flex-col bg-white border border-stone-200 shadow-sm rounded-xl">
      <div class="flex gap-x-3">
        <div class="grow">
          <h2 class="text-sm md:text-base text-gray-600 font-medium">{{ t("progress.overview.totalSessionDuration.title") }}</h2>
          <p class="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">{{ totalDuration }}</p>
        </div>
        <svg
          class="shrink-0 size-6 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 22h14" />
          <path d="M5 2h14" />
          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        </svg>
      </div>
    </div>
    <!-- End Card -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { useI18n } from "vue-i18n"
import { userProgressStore } from "@/app"
import { formatDuration } from "@/shared/lib"

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const userProgress = computed(() => userProgressStore.getCurrentUserProgress)
    const totalSessions = computed(() => userProgress.value?.total_sessions ?? 0)
    const totalDuration = computed(() => formatDuration(userProgress.value?.total_session_duration ?? 0))

    return {
      totalSessions,
      totalDuration,
      t,
    }
  },
})
</script>
