<template>
  <div class="space-y-3">
    <label class="text-sm font-medium text-gray-700">{{ label }}</label>

    <div class="flex flex-wrap items-center gap-4">
      <div class="relative w-full max-w-xs">
        <input
          v-model="newTag"
          @keydown.enter.prevent="addTagFromInput"
          type="text"
          class="w-full bg-white border border-gray-300 rounded-md px-4 py-2 pr-14 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition"
          :placeholder="placeholder"
        />
        <button class="absolute right-1.5 top-1.5 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-indigo-700" @click="addTagFromInput" type="button">Add</button>
      </div>
    </div>

    <!-- error -->
    <p v-if="error" class="text-xs text-red-500 mt-1">
      {{ error }}
    </p>

    <div v-if="suggestions.length" class="space-y-1">
      <p class="text-xs text-gray-500 font-medium mb-2">Suggestions</p>
      <div class="flex flex-wrap gap-2">
        <button v-for="s in suggestions" :key="s" type="button" @click="addTag(s)" class="rounded-full bg-gray-50 px-3 py-1 text-xs text-slate-600 ring-1 ring-gray-200 hover:bg-gray-100">
          {{ s }}
        </button>
      </div>
    </div>

    <div v-if="modelValue.length" class="space-y-1">
      <p class="text-xs text-gray-500 font-medium mb-2">Selected tags</p>
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in modelValue" :key="tag" class="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-yellow-200">
          <span>#{{ tag }}</span>
          <button class="rounded-full p-1 hover:bg-yellow-200" @click="removeTag(tag)" type="button">
            <i class="fas fa-times text-[14px] text-slate-700" />
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
  name: "WorkshopTagInput",

  props: {
    modelValue: {
      type: Array as () => string[],
      required: true,
    },
    suggestions: {
      type: Array as () => string[],
      default: () => [],
    },
    label: {
      type: String,
      default: "Tags",
    },
    placeholder: {
      type: String,
      default: "Add tag and press Enter",
    },
    error: {
      type: String,
      default: "",
    },
  },

  setup(props, { emit }) {
    const newTag = ref("")

    const addTag = (tag?: string) => {
      const value = (tag ?? newTag.value).trim()
      if (!value || props.modelValue.includes(value)) return
      emit("update:modelValue", [...props.modelValue, value])
      newTag.value = ""
    }

    const removeTag = (tag: string) => {
      emit(
        "update:modelValue",
        props.modelValue.filter((t) => t !== tag)
      )
    }

    const addTagFromInput = (_event: KeyboardEvent | MouseEvent) => {
      addTag()
    }

    return { newTag, addTag, removeTag, addTagFromInput }
  },
})
</script>
