<template>
  <div class="space-y-2">
    <label class="text-sm font-medium text-gray-700">{{ label }}</label>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="level in options"
        :key="level"
        type="button"
        @click="select(level)"
        :class="[
          'rounded-full px-3 py-1 text-xs font-medium border transition',
          modelValue === level ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100',
        ]"
      >
        {{ level }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "DifficultySelector",

  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Array as () => string[],
      required: true,
    },
    label: {
      type: String,
      default: "Difficulty level",
    },
  },

  setup(_, { emit }) {
    const select = (level: string) => {
      emit("update:modelValue", level)
    }

    return { select }
  },
})
</script>
