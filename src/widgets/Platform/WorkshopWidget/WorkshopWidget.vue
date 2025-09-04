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
            <pre class="text-sm text-gray-800 font-mono whitespace-pre-wrap">
              {{ JSON.stringify(scenarioReview, null, 2) }}
            </pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { commonStore } from "@/app"
import { TheLoader } from "@/shared/components"
import { ScenarioBasicInformation, ScenarioContent, ScenarioMetadataActions } from "./ui"
import { IPromptScenarioEntity, VocabularyFrequencyLevelEnum } from "@/shared/types"

export default defineComponent({
  components: {
    TheLoader,
    ScenarioBasicInformation,
    ScenarioContent,
    ScenarioMetadataActions,
  },

  setup() {
    const scenarioReview = ref<Partial<IPromptScenarioEntity>>({
      name: "",
      title: "",
      description: "",
      level: VocabularyFrequencyLevelEnum.A1,
      user_content: {
        goals: [
          {
            phrase: "",
            translation: {},
          },
        ],
        dictionary: [
          {
            word: "",
            translation: {},
            meaning: "",
          },
        ],
        phrases: [
          {
            phrase: "",
            translation: {},
            meaning: "",
          },
        ],
      },
      model_behavior: {
        prompt: "",
        scenario: {
          setting: "",
          situation: "",
          goal: "",
          steps: [],
          optional_steps: [],
        },
        ielts_scenario: {
          setting: "",
          part1: {
            topics: [
              {
                title: "",
                questions: [],
              },
            ],
          },
          part2: {
            title: "",
            question: "",
            bullet_points: [],
          },
          part3: {
            topics: [
              {
                title: "",
                questions: [],
              },
            ],
          },
        },
      },
      meta: {
        estimated_duration_minutes: 0,
        max_turns: 0,
        model_end_behavior: "",
        target_language: "",
        question_count_range: {
          min: 0,
          max: 0,
        },
        is_it_ielts: false,
        active_ielts_part: undefined,
      },
      is_module_only: false,
    })

    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)

    return {
      scenarioReview,
      getIsPageLoading,
    }
  },
})
</script>
