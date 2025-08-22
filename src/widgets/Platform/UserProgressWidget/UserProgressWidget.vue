<template>
  <div class="flex-grow min-h-0 bg-gray-50">
    <TheLoader v-if="!isReady" />

    <div class="pt-16 max-w-[1720px] w-full mx-auto" v-else>
      <div class="py-10 px-6">
        <h1 class="text-3xl font-bold text-text-base mb-6">Progress</h1>

        <div class="space-y-6">
          <ProgressOverview />
        </div>

        <div class="pt-2 md:pt-6 space-y-6">
          <DayStreakProgress />
        </div>

        <div class="pt-2 md:pt-6 space-y-6">
          <IeltsProgressChart />
        </div>

        <div class="pt-2 md:pt-6 space-y-6">
          <CefrProgressChart />
        </div>

        <div class="pt-2 md:pt-6 flex flex-col gap-2 md:flex-row md:gap-4">
          <ErrorStatsList />

          <CompletedPromptsList />
        </div>

        <div class="pt-2 md:pt-6 space-y-6">
          <TasksTimeline />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount, defineAsyncComponent } from "vue"
import { userProgressStore } from "@/app"
import { TheLoader } from "@/shared/components"

export default defineComponent({
  components: {
    TheLoader,
    ProgressOverview: defineAsyncComponent(() => import("./ui/ProgressOverview")),
    IeltsProgressChart: defineAsyncComponent(() => import("./ui/IeltsProgressChart")),
    CefrProgressChart: defineAsyncComponent(() => import("./ui/CefrProgressChart")),
    ErrorStatsList: defineAsyncComponent(() => import("./ui/ErrorStatsList")),
    CompletedPromptsList: defineAsyncComponent(() => import("./ui/CompletedPromptsList")),
    TasksTimeline: defineAsyncComponent(() => import("./ui/TasksTimeline")),
    DayStreakProgress: defineAsyncComponent(() => import("./ui/DayStreakProgress")),
  },

  setup() {
    const isReady = ref<boolean>(false)

    const getCurrentUserProgress = computed(() => userProgressStore.getCurrentUserProgress)

    onBeforeMount(async () => {
      await fetchUserProgress()

      isReady.value = true
    })

    const fetchUserProgress = async () => {
      try {
        await userProgressStore.fetchCurrentUserProgress()
      } catch (error: unknown) {
        console.error("Error fetching user progress:", error)
      }
    }

    return {
      isReady,
      getCurrentUserProgress,
    }
  },
})
</script>
