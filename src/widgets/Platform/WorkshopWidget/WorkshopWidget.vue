<template>
  <div class="flex-grow min-h-0 bg-gray-50">
    <TheLoader v-if="getIsPageLoading" />

    <div v-else class="pt-16 max-w-[1720px] w-full mx-auto">
      <div class="py-10 px-6">
        <h1 class="text-3xl font-bold text-text-base mb-6">Workshop</h1>

        <div class="flex gap-8 items-start">
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { commonStore, workshopStore } from "@/app"
import { TheLoader } from "@/shared/components"
import { ScenarioBasicInformation, ScenarioContent, ScenarioMetadataActions } from "./ui"
import { WorkshopScenarioTypeEnum } from "@/shared/types"

export default defineComponent({
  components: {
    TheLoader,
    ScenarioBasicInformation,
    ScenarioContent,
    ScenarioMetadataActions,
  },

  setup() {
    const getBasicInformation = computed(() => workshopStore.getBasicInformation)
    const getScenarioContent = computed(() => workshopStore.getScenarioContent)
    const getMetadataActions = computed(() => workshopStore.getMetadataActions)
    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)
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

    return {
      getScenarioReview,
      getIsPageLoading,
    }
  },
})
</script>
