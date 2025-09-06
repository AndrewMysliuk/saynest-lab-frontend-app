<template>
  <div class="space-y-2">
    <label v-if="label" class="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-1" @click="focusInput">
      {{ label }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <component
      v-input-mask="maskOptions"
      :is="isMultiline ? 'textarea' : 'input'"
      ref="inputRef"
      :value="modelValue"
      @input="onInput"
      :type="isMultiline ? undefined : 'text'"
      :rows="isMultiline ? rows : undefined"
      :placeholder="placeholder"
      class="w-full bg-white border rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition"
      :class="{ 'border-red-500': !!error }"
    />

    <p v-if="error" class="text-xs text-red-500 mt-1">
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue"

export default defineComponent({
  name: "WorkshopTextField",

  props: {
    modelValue: {
      type: String,
      required: true,
    },

    maskOptions: {
      type: Object,
      default: () => ({}),
    },

    label: {
      type: String,
      default: "",
    },

    placeholder: {
      type: String,
      default: "",
    },

    isMultiline: {
      type: Boolean,
      default: false,
    },

    rows: {
      type: Number,
      default: 3,
    },

    error: {
      type: String,
      default: "",
    },

    isRequired: {
      type: Boolean,
      default: false,
    },
  },

  setup(_, { emit }) {
    const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)

    const onInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement
      emit("update:modelValue", target.value)
    }

    const focusInput = () => {
      nextTick(() => {
        inputRef.value?.focus()
      })
    }

    return {
      inputRef,
      onInput,
      focusInput,
    }
  },
})
</script>
