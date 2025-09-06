<template>
  <div class="relative w-full">
    <label v-if="label" class="mb-2 block text-sm font-medium text-gray-700">{{ label }}</label>

    <button
      class="flex items-center justify-between w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#4F46E5] transition"
      @click="toggleDropdown"
      type="button"
    >
      <span>{{ selectedOption?.label || placeholder }}</span>
      <svg class="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-if="isOpen" class="absolute mt-2 z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
      <ul>
        <li v-for="opt in options" :key="opt.value" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" @click="selectOption(opt)">
          {{ opt.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue"
import { IWorkshopSelectFieldOptions } from "@/shared/types"

export default defineComponent({
  name: "WorkshopSelectField",

  props: {
    modelValue: {
      type: String,
      required: true,
    },

    options: {
      type: Array as () => IWorkshopSelectFieldOptions[],
      required: true,
    },

    label: {
      type: String,
      default: "",
    },

    placeholder: {
      type: String,
      default: "Select",
    },
  },

  setup(props, { emit }) {
    const isOpen = ref(false)
    const selectedOption = ref<IWorkshopSelectFieldOptions | null>(null)

    const initSelected = () => {
      selectedOption.value = props.options.find((o) => o.value === props.modelValue) || null
    }

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    const selectOption = (opt: IWorkshopSelectFieldOptions) => {
      if (opt.value === props.modelValue) {
        isOpen.value = false
        return
      }

      emit("update:modelValue", opt.value)
      selectedOption.value = opt
      isOpen.value = false
    }

    watch(() => props.modelValue, initSelected, { immediate: true })

    return {
      isOpen,
      selectedOption,
      toggleDropdown,
      selectOption,
    }
  },
})
</script>
