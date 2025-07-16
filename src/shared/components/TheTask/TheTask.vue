<template>
  <div :class="['w-full overflow-y-auto  rounded-xl pointer-events-auto ', isModal ? 'md:w-[720px] h-[80vh] p-4 bg-gray-50 shadow-xl' : 'max-w-full']">
    <div class="flex flex-col gap-4 relative">
      <h2 class="text-xl font-semibold text-gray-800" v-if="isModal">Task Review</h2>
      <!-- Close Button -->
      <div class="absolute top-0 end-0 z-10" v-if="isModal">
        <button
          @click="$emit('close')"
          type="button"
          class="size-8 shrink-0 flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
        >
          <span class="sr-only">Close</span>
          <svg
            class="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <!-- End Close Button -->

      <div v-for="task in getTasksList" :key="task._id" :class="['space-y-6 border border-gray-200 p-6 rounded-xl shadow-sm', isModal ? 'bg-white' : 'bg-gray-50']">
        <h3 class="text-lg font-semibold text-gray-800">{{ task.topic_title }}</h3>

        <!-- Multiple Choice Block -->
        <div v-if="isMultipleChoiceTask(task)" class="space-y-6">
          <div v-for="sentence in task.task.sentences" :key="sentence.id">
            <p class="font-medium text-gray-800 mb-2">{{ sentence.prompt }}</p>

            <div class="space-y-2">
              <label
                v-for="option in sentence.options"
                :key="option"
                :class="[
                  'flex items-center space-x-2 p-2 rounded-md border transition-all duration-150',
                  {
                    'cursor-pointer': !isTaskChecked(task._id),
                    'bg-green-50 border-green-300': isTaskChecked(task._id) && option === sentence.answer,
                    'bg-red-50 border-red-300': isTaskChecked(task._id) && getSelectedAnswersMap[task._id]?.[sentence.id] === option && option !== sentence.answer,
                    'bg-white border-gray-300 hover:bg-gray-50': !isTaskChecked(task._id),
                    'bg-white border-gray-200': isTaskChecked(task._id) && option !== sentence.answer && getSelectedAnswersMap[task._id]?.[sentence.id] !== option,
                  },
                ]"
              >
                <input
                  type="radio"
                  :name="`task-${task._id}-sentence-${sentence.id}`"
                  :value="option"
                  class="accent-primary"
                  :checked="getSelectedAnswersMap[task._id]?.[sentence.id] === option"
                  @change="onSelectAnswer(task._id, sentence.id, option)"
                  :disabled="isTaskChecked(task._id)"
                />
                <span>{{ option }}</span>
              </label>
            </div>

            <p v-if="isTaskChecked(task._id)" class="text-sm text-gray-600 mt-2 italic">
              {{ sentence.explanation }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            v-if="!isTaskChecked(task._id)"
            @click="checkTask(task._id)"
            :disabled="isTaskChecked(task._id)"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none rounded-md transition"
          >
            Check
          </button>

          <p v-if="isTaskChecked(task._id)" class="text-sm text-gray-800 font-medium">Correct: {{ getCorrectCount(task) }} / {{ task.task.sentences.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { taskGeneratorStore } from "@/app"
import { IGenericTaskEntity, IMultipleChoiceTask, TaskTypeEnum } from "@/shared/types"

export default defineComponent({
  props: {
    isModal: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const checkedTasks = ref<Set<string>>(new Set())

    const getTasksList = computed(() => taskGeneratorStore.getTasksList)
    const getSelectedAnswersMap = computed(() => taskGeneratorStore.selectedAnswersMap)

    const isMultipleChoiceTask = (task: IGenericTaskEntity): task is IGenericTaskEntity<IMultipleChoiceTask> => {
      return task.type === TaskTypeEnum.MULTIPLE_CHOICE
    }

    const isTaskChecked = (taskId: string) => {
      const isChecked = checkedTasks.value.has(taskId)
      const isCompleted = getTasksList.value?.find((item) => item._id === taskId)?.is_completed || false

      return isChecked || isCompleted
    }

    const checkTask = async (taskId: string) => {
      if (!Object.keys(getSelectedAnswersMap.value[taskId]).length) return

      try {
        await taskGeneratorStore.fetchSetCompleted(taskId, getSelectedAnswersMap.value[taskId])
        checkedTasks.value.add(taskId)
      } catch (error: unknown) {
        console.log(error)
      }
    }

    const getCorrectCount = (task: IGenericTaskEntity): number => {
      const answers = getSelectedAnswersMap.value[task._id] || {}
      return task.task.sentences.reduce((acc, sentence) => {
        return answers[sentence.id] === sentence.answer ? acc + 1 : acc
      }, 0)
    }

    function onSelectAnswer(taskId: string, sentenceId: number, option: string) {
      taskGeneratorStore.selectTaskAnswer({ taskId, sentenceId, option })
    }

    return {
      getTasksList,
      getSelectedAnswersMap,
      isMultipleChoiceTask,
      isTaskChecked,
      checkTask,
      getCorrectCount,
      onSelectAnswer,
    }
  },
})
</script>
