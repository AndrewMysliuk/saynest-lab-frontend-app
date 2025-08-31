<template>
  <div>
    <div class="p-5 bg-white border border-stone-200 shadow rounded-xl">
      <h2 class="text-base font-semibold text-gray-900 mb-4">
        {{ t("progress.timeline.title") }}
      </h2>

      <ul v-if="sortedTasks.length" class="divide-y divide-gray-200">
        <li
          v-for="task in sortedTasks"
          :key="task.task_id"
          @click="getTaskById(task.task_id)"
          class="md:h-[105px] border-t border-gray-200 rounded-lg px-4 py-3 cursor-pointer transition hover:bg-gray-50"
        >
          <div class="flex justify-between items-start gap-4">
            <div class="space-y-1">
              <h3 class="text-sm font-semibold text-gray-800">
                {{ task.topic_title }}
              </h3>
              <p class="text-xs text-gray-400 uppercase tracking-wide">
                {{ task.type.replace(/_/g, " ") }}
              </p>
              <p class="text-xs text-gray-500">{{ t("progress.timeline.labels.started") }} {{ formatDate(task.created_at) }}</p>
              <p v-if="task.is_completed" class="text-xs text-gray-500">{{ t("progress.timeline.labels.completed") }} {{ formatDate(task.completed_at) }}</p>
            </div>

            <span class="text-sm font-medium px-3 py-2 rounded inline-flex items-center gap-2" :class="task.is_completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
              <i :class="task.is_completed ? 'fas fa-check-circle' : 'fas fa-hourglass-half'" class="text-sm"></i>
              <span class="hidden sm:inline">
                {{ task.is_completed ? t("progress.timeline.status.completed") : t("progress.timeline.status.inProgress") }}
              </span>
            </span>
          </div>
        </li>
      </ul>

      <div v-else class="text-gray-400 text-sm">
        {{ t("progress.timeline.empty") }}
      </div>
    </div>

    <v-modal v-model="isTaskModalOpen">
      <TheTask is-modal @close="isTaskModalOpen = false" />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { taskGeneratorStore, userProgressStore } from "@/app"
import { TheTask } from "@/shared/components"

export default defineComponent({
  components: {
    TheTask,
  },

  setup() {
    const { t } = useI18n()
    const isTaskModalOpen = ref<boolean>(false)

    const tasks = computed(() => userProgressStore.getCurrentUserProgress?.tasks || [])
    const sortedTasks = computed(() => [...tasks.value].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10))

    const getTaskById = async (taskId: string) => {
      try {
        await taskGeneratorStore.fetchTask(taskId)

        isTaskModalOpen.value = true
      } catch (error) {
        console.error("Error in getTaskById:", error)
      }
    }

    const formatDate = (date: string | Date) =>
      new Date(date).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })

    return {
      isTaskModalOpen,
      sortedTasks,
      getTaskById,
      formatDate,
      t,
    }
  },
})
</script>
