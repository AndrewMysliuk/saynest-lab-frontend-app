<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    <div v-for="(module, index) in getModuleList" :key="index" class="relative">
      <div
        v-if="isLocked && !AVAILABLE_MODULES.includes(module._id)"
        class="absolute inset-0 z-10 bg-gray-700/20 flex items-center justify-center rounded-2xl cursor-pointer"
        @click="$router.push({ name: 'platform.tariff-plans' })"
      >
        <i class="fas fa-lock text-gray-600 text-3xl" title="Module is locked" />
      </div>

      <div
        @click="openScenarios(module._id)"
        @keyup.enter="openScenarios(module._id)"
        role="button"
        tabindex="0"
        :class="[
          'cursor-pointer bg-white rounded-2xl p-6 border shadow transition-all duration-200 flex flex-col h-full',
          'hover:-translate-y-[2px] focus-visible:outline focus-visible:outline-2',
          module.type === ModuleTypeEnum.STRUCTURED
            ? 'border-gray-200 hover:border-purple-500 hover:ring-2 hover:ring-purple-300 focus-visible:outline-purple-500'
            : 'border-gray-200 hover:border-blue-500 hover:ring-2 hover:ring-blue-300 focus-visible:outline-blue-500',
          isLocked && !AVAILABLE_MODULES.includes(module._id) ? 'pointer-events-none opacity-60' : '',
        ]"
      >
        <div class="flex items-center justify-between mb-3 h-[32px]">
          <h3 class="text-xl font-semibold text-gray-800 truncate" :title="module.title">
            {{ module.title }}
          </h3>
          <span class="text-sm font-medium text-gray-400">({{ module.level.join("-") }})</span>
        </div>

        <p class="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">
          {{ module.description }}
        </p>

        <div class="mb-5 h-[28px] flex items-center">
          <span
            v-if="module.type === ModuleTypeEnum.STRUCTURED"
            class="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full border border-purple-300"
            title="Structured Module"
          >
            Structured Module
          </span>
          <span v-else class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200" title="Open Practice"> Open Practice </span>
        </div>

        <div class="flex flex-wrap gap-2 overflow-hidden">
          <span v-for="tag in module.tags" :key="tag" class="inline-block bg-amber-50 text-amber-800 text-xs font-medium px-3 py-1 rounded-full border border-amber-200">
            {{ formatTagLabel(tag) }}
          </span>
        </div>
      </div>
    </div>

    <p v-if="!getModuleList.length" class="text-sm text-center text-gray-400 italic w-full col-span-full">No modules found.</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { promptStore, subscriptionStore } from "@/app"
import { ModuleTypeEnum } from "@/shared/types"
import { formatTagLabel } from "@/shared/lib"
import { AVAILABLE_MODULES } from "@/shared/utils"

export default defineComponent({
  setup(_, { emit }) {
    const getModuleList = computed(() => promptStore.getModuleList)
    const isLocked = computed(() => subscriptionStore.getIsExpiredVisible || !subscriptionStore.getIsHasSubscription)

    const openScenarios = (module_id: string) => {
      emit("openScenarios", module_id)
    }

    return {
      AVAILABLE_MODULES,
      getModuleList,
      isLocked,
      ModuleTypeEnum,
      openScenarios,
      formatTagLabel,
    }
  },
})
</script>
