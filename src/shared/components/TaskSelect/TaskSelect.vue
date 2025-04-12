<template>
  <div class="task-select">
    <button v-if="selectedType" class="task-select__back" @click="goBack" aria-label="Back">← Back</button>

    <template v-if="!selectedType">
      <h2>Select a Task Type</h2>
      <div class="task-select__grid">
        <div v-for="(modes, type) in taskOptions" :key="type" class="task-select__card" @click="handleTypeSelect(type, modes)">{{ getTaskEmoji(type) }} {{ formatEnum(type) }}</div>
      </div>
    </template>

    <template v-else-if="selectedModes.length > 1">
      <h2>Select a Mode for {{ formatEnum(selectedType) }}</h2>
      <div class="task-select__grid">
        <div v-for="mode in selectedModes" :key="mode" class="task-select__card" @click="onSelect(selectedType, mode)">{{ getModeEmoji(mode) }} {{ formatEnum(mode) }}</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { TaskModeEnum, TaskTypeEnum } from "@/shared/types"
import { taskGeneratorStore } from "@/app"
import { useRouter } from "vue-router"

const taskOptions = {
  FILL_BLANK: [TaskModeEnum.WRITE, TaskModeEnum.SELECT],
  MATCH_TRANSLATION: [TaskModeEnum.SELECT],
  REORDER_WORDS: [TaskModeEnum.DRAG_AND_DROP, TaskModeEnum.SELECT],
  MULTIPLE_CHOICE: [TaskModeEnum.CHECKBOX_MULTIPLE],
  CORRECT_SENTENCE: [TaskModeEnum.SELECT],
  LISTEN_AND_TYPE: [TaskModeEnum.LISTEN_AND_WRITE],
}

export default defineComponent({
  props: {
    topicTitle: {
      type: String,
      default: "",
    },
  },

  setup(props, { emit }) {
    const router = useRouter()
    const selectedType = ref<keyof typeof taskOptions | null>(null)
    const selectedModes = ref<TaskModeEnum[]>([])

    const handleTypeSelect = (type: keyof typeof taskOptions, modes: TaskModeEnum[]) => {
      if (modes.length === 1) {
        onSelect(type, modes[0])
      } else {
        selectedType.value = type
        selectedModes.value = modes
      }
    }

    const onSelect = async (type: string, mode: TaskModeEnum) => {
      try {
        taskGeneratorStore.generateTask({
          // user_id: "01fbe55b-9784-4fc9-90ff-3695d836cc2e",
          // organization_id: "01fbe55b-9784-4fc9-90ff-3695d836cc2e",
          gpt_payload: {
            model: "gpt-4o-mini",
          },
          type: TaskTypeEnum[type as keyof typeof TaskTypeEnum],
          mode,
          sentence_count: 10,
          topic_titles: props.topicTitle ? [props.topicTitle] : [],
          language: "bg",
          native_language: "uk",
        })

        emit("close")

        router.push({ name: "sendbox.task-practice" })
      } catch (error: unknown) {
        console.log(error)
      }
    }

    const formatEnum = (str: string) => {
      return str
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/(^|\s)\S/g, (l) => l.toUpperCase())
    }

    const goBack = () => {
      selectedType.value = null
      selectedModes.value = []
    }

    const getTaskEmoji = (type: string): string => {
      switch (type) {
        case "FILL_BLANK":
          return "✏️"
        case "MATCH_TRANSLATION":
          return "🔁"
        case "REORDER_WORDS":
          return "🔀"
        case "MULTIPLE_CHOICE":
          return "❓"
        case "CORRECT_SENTENCE":
          return "✅"
        case "LISTEN_AND_TYPE":
          return "🎧"
        default:
          return "📘"
      }
    }

    const getModeEmoji = (mode: string): string => {
      switch (mode) {
        case "WRITE":
          return "📝"
        case "SELECT":
          return "☑️"
        case "CHECKBOX_MULTIPLE":
          return "📋"
        case "DRAG_AND_DROP":
          return "🖱️"
        case "LISTEN_AND_WRITE":
          return "🔊"
        default:
          return "🔧"
      }
    }

    return {
      taskOptions,
      selectedType,
      selectedModes,
      goBack,
      handleTypeSelect,
      onSelect,
      formatEnum,
      getTaskEmoji,
      getModeEmoji,
    }
  },
})
</script>

<style lang="scss" src="./TaskSelect.scss" />
