<template>
  <div>
    <label v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</label>

    <div class="flex flex-wrap gap-3 mt-2">
      <label v-for="opt in options" :key="opt" class="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer transition">
        <input class="accent-indigo-600" type="radio" :name="groupName" :value="opt" :checked="modelValue === opt" @change="update(opt)" />
        <span class="text-sm text-gray-700">{{ visibilityLabels[opt] }}</span>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { ModuleTypeEnum, WorkshopVisabilityEnum } from "@/shared/types"

export default defineComponent({
  name: "WorkshopRadioGroup",

  props: {
    modelValue: {
      type: String,
      required: true,
    },

    options: {
      type: Array as PropType<string[]>,
      required: true,
    },

    label: {
      type: String,
      default: "",
    },

    groupName: {
      type: String,
      default: "radio-group",
    },
  },

  setup(_, { emit }) {
    const visibilityLabels: Record<string, string> = {
      [WorkshopVisabilityEnum.PUBLIC]: "Public",
      [WorkshopVisabilityEnum.PRIVATE]: "Private",
      [WorkshopVisabilityEnum.TEAM_ONLY]: "Team only",
      [ModuleTypeEnum.FLAT]: "Basic",
      [ModuleTypeEnum.STRUCTURED]: "Complex",
    }

    const update = (val: string) => emit("update:modelValue", val)

    return {
      visibilityLabels,
      update,
    }
  },
})
</script>
