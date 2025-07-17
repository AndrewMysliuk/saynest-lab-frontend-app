<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    <div
      v-for="(module, index) in getModuleList"
      :key="index"
      @click="openScenarios(module._id)"
      class="cursor-pointer bg-white rounded-2xl p-6 border border-gray-200 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col h-full"
    >
      <div class="flex items-center justify-between mb-3 h-[32px]">
        <h3 class="text-xl font-semibold text-gray-800 truncate">
          {{ module.title }}
        </h3>
        <span class="text-sm font-medium text-gray-400"> ({{ module.level.join("-") }}) </span>
      </div>

      <p class="text-sm text-gray-600 leading-relaxed mb-3 h-[64px] overflow-hidden">
        {{ module.description }}
      </p>

      <div class="mb-5 h-[28px] flex items-center">
        <span
          v-if="module.type === ModuleTypeEnum.STRUCTURED"
          class="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full border border-purple-300"
        >
          Structured Module
        </span>
        <span v-else class="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full border border-gray-300"> Open Practice </span>
      </div>

      <div class="flex flex-wrap gap-2 overflow-hidden">
        <span v-for="tag in module.tags" :key="tag" class="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">
          {{ formatTagLabel(tag) }}
        </span>
      </div>
    </div>

    <p v-if="!getModuleList.length" class="text-sm text-center text-gray-400 italic w-full col-span-full">No modules found.</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { promptStore } from "@/app"
import { ModuleTypeEnum } from "@/shared/types"
import { formatTagLabel } from "@/shared/lib"

export default defineComponent({
  setup(_, { emit }) {
    const getModuleList = computed(() => promptStore.getModuleList)

    const openScenarios = (module_id: string) => {
      emit("openScenarios", module_id)
    }

    return {
      getModuleList,
      ModuleTypeEnum,
      openScenarios,
      formatTagLabel,
    }
  },
})
</script>
