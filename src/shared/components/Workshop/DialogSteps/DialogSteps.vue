<template>
  <div class="mt-10">
    <div class="mb-2 text-sm font-medium">{{ title }}</div>

    <div class="space-y-3">
      <div
        v-for="(value, index) in steps"
        :key="`step-${index}`"
        class="rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200"
        :class="{
          'ring-[#4F46E5]': dragOverIndex === index,
          'opacity-80': dragFromIndex === index,
        }"
        :draggable="dragEnabledIndex === index"
        @dragstart="onDragStart(index, $event)"
        @dragover="onDragOver(index, $event)"
        @drop="onDrop(index, $event)"
        @dragend="onDragEnd"
      >
        <div class="flex items-end gap-2">
          <button
            type="button"
            class="drag-handle h-[38px] px-2 shrink-0 inline-flex items-center justify-center rounded-md ring-1 ring-gray-200 transition hover:bg-white cursor-grab active:cursor-grabbing"
            aria-label="Drag to reorder"
            title="Hold and drag to reorder"
            tabindex="-1"
            @mousedown="enableDrag(index)"
            @mouseup="disableDrag"
            @mouseleave="disableDrag"
          >
            <i class="fa-solid fa-grip-vertical"></i>
          </button>

          <TextField class="flex-1" :model-value="value" @update:model-value="(v: string) => updateStep(index, v)" :label="fieldLabel" :placeholder="placeholder" />

          <button
            type="button"
            @click="removeStep(index)"
            :disabled="isDisabled || steps.length <= minItems"
            class="py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            <i class="fa-solid fa-xmark"></i>
            Remove
          </button>
        </div>
      </div>

      <button
        type="button"
        @click="addStep"
        :disabled="isDisabled || (maxItems !== null && steps.length >= maxItems)"
        class="py-2 px-2.5 w-full md:w-auto inline-flex justify-center items-center gap-x-1.5 text-[13px] md:text-sm rounded-lg shadow-md bg-[#4F46E5] text-white hover:bg-[#4338CA]"
      >
        <i class="fa-solid fa-plus"></i>
        Add step
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue"
import TextField from "../TextField"

export default defineComponent({
  name: "WorkshopDialogSteps",

  components: { TextField },

  props: {
    modelValue: { type: Array as () => string[], required: true },
    title: { type: String, default: "Model Conversation Steps" },
    fieldLabel: { type: String, default: "Describe the model’s action or question" },
    placeholder: { type: String, default: "e.g. Ask the guest for their reservation details" },
    minItems: { type: Number, default: 0 },
    maxItems: { type: Number as () => number | null, default: null },
    isDisabled: { type: Boolean, default: false },
  },

  setup(props, { emit }) {
    const steps = computed(() => props.modelValue ?? [])

    const dragEnabledIndex = ref<number | null>(null)
    const dragFromIndex = ref<number | null>(null)
    const dragOverIndex = ref<number | null>(null)

    const commit = (next: string[]) => {
      emit("update:modelValue", next)
      emit("change", next)
    }

    const addStep = () => {
      if (props.isDisabled) return
      if (props.maxItems !== null && steps.value.length >= props.maxItems) return
      commit([...steps.value, ""])
      emit("add", steps.value.length - 1)
    }

    const removeStep = (index: number) => {
      if (props.isDisabled) return
      if (steps.value.length <= props.minItems) return
      const next = steps.value.slice()
      next.splice(index, 1)
      commit(next)
      emit("remove", index)
    }

    const updateStep = (index: number, value: string) => {
      const next = steps.value.slice()
      next[index] = value
      commit(next)
    }

    const enableDrag = (index: number) => {
      dragEnabledIndex.value = index
    }
    const disableDrag = () => {
      dragEnabledIndex.value = null
    }

    const onDragStart = (index: number, e: DragEvent) => {
      if (dragEnabledIndex.value !== index) {
        e.preventDefault()
        return
      }
      dragFromIndex.value = index
      dragOverIndex.value = index
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/plain", String(index))
      }
    }

    const onDragOver = (index: number, e: DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move"
      dragOverIndex.value = index
    }

    const onDrop = (index: number, e: DragEvent) => {
      e.preventDefault()
      const from = dragFromIndex.value
      if (from === null || from === index) {
        resetDrag()
        return
      }
      const next = steps.value.slice()
      const [moved] = next.splice(from, 1)
      next.splice(index, 0, moved)
      commit(next)
      resetDrag()
    }

    const onDragEnd = () => {
      resetDrag()
    }

    const resetDrag = () => {
      dragEnabledIndex.value = null
      dragFromIndex.value = null
      dragOverIndex.value = null
    }

    return {
      steps,
      addStep,
      removeStep,
      updateStep,
      dragEnabledIndex,
      dragFromIndex,
      dragOverIndex,
      enableDrag,
      disableDrag,
      onDragStart,
      onDragOver,
      onDrop,
      onDragEnd,
    }
  },
})
</script>
