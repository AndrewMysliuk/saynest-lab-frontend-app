<template>
  <div>
    <div class="bg-white p-4 rounded-xl shadow">
      <h2 class="text-lg font-semibold mb-4">Task History</h2>

      <div v-if="sortedTasks.length" class="space-y-4">
        <div
          v-for="task in sortedTasks"
          :key="task.task_id"
          @click="getTaskById(task.task_id)"
          class="cursor-pointer border border-stone-200 rounded-lg p-4 flex justify-between items-start hover:bg-stone-50 transition"
        >
          <div class="space-y-1">
            <h3 class="font-medium text-stone-800">{{ task.topic_title }}</h3>
            <p class="text-xs text-stone-500 uppercase tracking-wide">
              {{ task.type.replace("_", " ") }}
            </p>
            <p class="text-sm text-stone-500">Started: {{ formatDate(task.created_at) }}</p>
            <p v-if="task.is_completed" class="text-sm text-stone-500">Completed: {{ formatDate(task.completed_at) }}</p>
          </div>

          <span
            :class="{
              'text-green-500': task.is_completed,
              'text-yellow-500': !task.is_completed,
            }"
            class="text-sm font-semibold"
          >
            {{ task.is_completed ? "✔ Completed" : "⏳ In Progress" }}
          </span>
        </div>
      </div>

      <div v-else class="text-gray-400 text-sm">No tasks yet. Go get some learning done.</div>
    </div>

    <v-modal v-model="isTaskModalOpen">
      <div class="h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow">
        <TheTask />
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { taskGeneratorStore, userProgressStore } from "@/app"
import { TheTask } from "@/shared/components"

export default defineComponent({
  components: {
    TheTask,
  },

  setup() {
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
    }
  },
})
</script>
