<template>
  <section class="max-w-4xl rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-5">
      <div>
        <h2 class="text-base font-semibold">Basic Information</h2>
        <p class="text-sm text-slate-500 mt-2">Core details for organizing and discovering your scenario</p>
      </div>
      <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"> Required </span>
    </div>
    <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      <div class="space-y-2 md:col-span-2">
        <WorkshopTextField :model-value="getBasicInformation.title" @update:model-value="updateTitle" label="Title" placeholder="e.g. Ordering coffee in Paris" />
      </div>

      <div class="space-y-2 md:col-span-2">
        <WorkshopTextField
          :model-value="getBasicInformation.description"
          @update:model-value="updateDescription"
          label="Description"
          placeholder="Short description to help teammates understand the context"
          is-multiline
          :rows="3"
        />
      </div>

      <div class="space-y-2">
        <TheCountryLanguage :model-value="getBasicInformation.target_language" @update:model-value="updateTargetLanguage" label="Target language" />
      </div>

      <div class="space-y-2">
        <WorkshopSelectField
          :model-value="getBasicInformation.scenario_type"
          @update:model-value="updateScenarioType"
          :options="scenarioTypeOptions"
          label="Scenario type"
          placeholder="Choose scenario"
        />
      </div>

      <div class="space-y-2">
        <WorkshopDifficultySelector :model-value="getBasicInformation.difficulty_levels" @update:model-value="updateDifficultyLevels" :options="difficulties" label="Choose difficulty" />
      </div>

      <!-- <div class="space-y-2">
        <WorkshopTagInput :model-value="getBasicInformation.tags" @update:model-value="updateTags" :suggestions="tagSuggestions" label="Tags" placeholder="Add tag and press Enter" />
      </div> -->

      <div class="space-y-2">
        <WorkshopRadioGroup :model-value="getBasicInformation.visibility" @update:model-value="updateVisibility" :options="visabilities" label="Visibility" />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Permissions</label>

        <div class="flex flex-col gap-3 mt-2">
          <label class="flex w-full items-center gap-3 cursor-pointer">
            <input type="checkbox" class="size-5 accent-[#4F46E5] rounded border-gray-300 transition" :checked="getBasicInformation.allow_copying" @change="updateAllowCopying" />
            <span class="text-sm text-gray-800">Allow copying</span>
          </label>

          <label class="flex w-full items-center gap-3 cursor-pointer">
            <input type="checkbox" class="size-5 accent-[#4F46E5] rounded border-gray-300 transition" :checked="getBasicInformation.is_module_only" @change="updateModuleOnly" />
            <span class="text-sm text-gray-800">Module-only flag</span>
          </label>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { workshopStore } from "@/app"
import { WorkshopTextField, TheCountryLanguage, WorkshopSelectField, WorkshopDifficultySelector, WorkshopRadioGroup } from "@/shared/components"
import { IWorkshopSelectFieldOptions, VocabularyFrequencyLevelEnum, WorkshopScenarioTypeEnum, WorkshopVisabilityEnum } from "@/shared/types"

export default defineComponent({
  components: {
    WorkshopTextField,
    TheCountryLanguage,
    WorkshopSelectField,
    WorkshopDifficultySelector,
    WorkshopRadioGroup,
  },

  setup() {
    const scenarioTypeOptions = ref<IWorkshopSelectFieldOptions[]>([
      {
        label: "Dialog",
        value: WorkshopScenarioTypeEnum.DIALOG,
      },
      {
        label: "IELTS",
        value: WorkshopScenarioTypeEnum.IELTS,
      },
    ])
    const difficulties = Object.values(VocabularyFrequencyLevelEnum)
    // const tagSuggestions = ref<string[]>(["interview", "travel", "money", "health", "small talk"])
    const visabilities = Object.values(WorkshopVisabilityEnum)

    const getBasicInformation = computed(() => workshopStore.getBasicInformation)

    const updateTitle = (value: string) => {
      workshopStore.setBasicInformation({
        title: value,
      })
    }

    const updateDescription = (value: string) => {
      workshopStore.setBasicInformation({
        description: value,
      })
    }

    const updateTargetLanguage = (value: string) => {
      workshopStore.setBasicInformation({
        target_language: value,
      })
    }

    const updateScenarioType = (value: WorkshopScenarioTypeEnum) => {
      workshopStore.setBasicInformation({
        scenario_type: value,
      })
    }

    const updateDifficultyLevels = (value: VocabularyFrequencyLevelEnum) => {
      workshopStore.setBasicInformation({
        difficulty_levels: value,
      })
    }

    // const updateTags = (value: string[]) => {
    //   workshopStore.setBasicInformation({
    //     tags: value,
    //   })
    // }

    const updateVisibility = (value: WorkshopVisabilityEnum) => {
      workshopStore.setBasicInformation({
        visibility: value,
      })
    }

    const updateAllowCopying = (event: Event) => {
      workshopStore.setBasicInformation({
        allow_copying: (event.target as HTMLInputElement).checked,
      })
    }

    const updateModuleOnly = (event: Event) => {
      workshopStore.setBasicInformation({
        is_module_only: (event.target as HTMLInputElement).checked,
      })
    }

    return {
      scenarioTypeOptions,
      difficulties,
      visabilities,
      getBasicInformation,
      updateTitle,
      updateDescription,
      updateTargetLanguage,
      updateScenarioType,
      updateDifficultyLevels,
      updateVisibility,
      updateAllowCopying,
      updateModuleOnly,
    }
  },
})
</script>
