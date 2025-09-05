<template>
  <div class="flex-grow min-h-0 bg-gray-50">
    <TheLoader v-if="getIsPageLoading" />

    <div v-else class="pt-16 max-w-[1720px] w-full mx-auto">
      <div class="py-10 px-6">
        <h1 class="text-3xl font-bold text-text-base mb-6">Workshop</h1>

        <div class="w-full">
          <div class="flex border-b border-gray-200">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-t-md border',
                activeTab === tab.value ? 'border-gray-200 border-b-white bg-white text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="mt-6">
          <div v-show="activeTab === WorkshopMenuTabEnum.SCENARIO" class="flex gap-8 items-start">
            <div class="max-w-4xl w-full shrink-0 space-y-4">
              <ScenarioBasicInformation />
              <ScenarioContent />
              <ScenarioMetadataActions />
            </div>

            <div class="w-full bg-white border border-gray-200 rounded-xl p-4">
              <p class="text-sm text-gray-800 font-mono whitespace-pre-wrap">
                {{ JSON.stringify(getScenarioReview, null, 2) }}
              </p>
            </div>
          </div>

          <div v-show="activeTab === WorkshopMenuTabEnum.MODULE" class="flex gap-8 items-start">
            <div class="max-w-4xl w-full shrink-0 space-y-4">
              <ModuleInfo />

              <ModuleAddFlatScenarios v-if="getModuleReview.type === ModuleTypeEnum.FLAT" />
              <ModuleAddComplexScenarios v-if="getModuleReview.type === ModuleTypeEnum.STRUCTURED" />
            </div>

            <div class="w-full bg-white border border-gray-200 rounded-xl p-4">
              <p class="text-sm text-gray-800 font-mono whitespace-pre-wrap">
                {{ JSON.stringify(getModuleReview, null, 2) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { commonStore, workshopStore } from "@/app"
import { TheLoader } from "@/shared/components"
import { ScenarioBasicInformation, ScenarioContent, ScenarioMetadataActions, ModuleInfo, ModuleAddFlatScenarios, ModuleAddComplexScenarios } from "./ui"
import { ModuleTypeEnum, WorkshopMenuTabEnum, WorkshopScenarioTypeEnum } from "@/shared/types"

export default defineComponent({
  components: {
    TheLoader,
    ScenarioBasicInformation,
    ScenarioContent,
    ScenarioMetadataActions,
    ModuleInfo,
    ModuleAddFlatScenarios,
    ModuleAddComplexScenarios,
  },

  setup() {
    const tabs = [
      { value: WorkshopMenuTabEnum.SCENARIO, label: "Create Scenario" },
      { value: WorkshopMenuTabEnum.MODULE, label: "Create Module" },
    ]
    const activeTab = ref<WorkshopMenuTabEnum>(WorkshopMenuTabEnum.MODULE)

    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)
    const getBasicInformation = computed(() => workshopStore.getBasicInformation)
    const getScenarioContent = computed(() => workshopStore.getScenarioContent)
    const getMetadataActions = computed(() => workshopStore.getMetadataActions)
    const getModuleInfo = computed(() => workshopStore.getModuleInfo)
    const getModuleScenariosFlat = computed(() => workshopStore.getModuleScenariosFlat)
    const getModuleStructureComplex = computed(() => workshopStore.getModuleStructureComplex)

    const getScenarioReview = computed(() => ({
      name: getBasicInformation.value.title.toLowerCase().replace(" ", "_"),
      title: getBasicInformation.value.title,
      description: getBasicInformation.value.description,
      level: getBasicInformation.value.difficulty_level,
      user_content: {
        goals: getScenarioContent.value.user_goals,
        dictionary: getScenarioContent.value.user_dictionary,
        phrases: getScenarioContent.value.user_phrases,
      },
      model_behavior: {
        scenario: getScenarioContent.value.dialog_behavior,
        ielts_scenario: getScenarioContent.value.ielts_behavior,
      },
      meta: {
        model_end_behavior: getMetadataActions.value.model_end_behavior,
        target_language: getBasicInformation.value.target_language,
        is_it_ielts: getBasicInformation.value.scenario_type === WorkshopScenarioTypeEnum.IELTS,
      },
      is_module_only: getBasicInformation.value.is_module_only,
    }))
    const getModuleReview = computed(() => ({
      name: getModuleInfo.value.title.toLowerCase().replace(" ", "_"),
      title: getModuleInfo.value.title,
      description: getModuleInfo.value.description,
      level: [],
      tags: getModuleInfo.value.tags,
      type: getModuleInfo.value.type,
      scenarios: getModuleScenariosFlat.value.scenarios,
      submodules: getModuleStructureComplex.value.submodules,
    }))

    return {
      tabs,
      activeTab,
      getScenarioReview,
      getModuleReview,
      getIsPageLoading,
      WorkshopMenuTabEnum,
      ModuleTypeEnum,
    }
  },
})
</script>
