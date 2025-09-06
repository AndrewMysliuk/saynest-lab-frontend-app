<template>
  <section class="rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
    <!-- Header -->
    <div class="flex items-start justify-between border-b border-gray-100 px-6 py-5">
      <div>
        <h2 class="text-base font-semibold">Basic Information</h2>
        <p class="text-sm text-slate-500 mt-2">Core details for organizing and discovering your scenario</p>
      </div>
      <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Basic Settings</span>
    </div>

    <!-- Body -->
    <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      <div class="space-y-2 md:col-span-2">
        <WorkshopTextField
          :model-value="localBasic.title"
          @update:model-value="(val: string) => (localBasic.title = val)"
          label="Title"
          placeholder="e.g. Ordering coffee in Paris"
          :error="titleError"
          is-required
        />
      </div>

      <div class="space-y-2 md:col-span-2">
        <WorkshopTextField
          :model-value="localBasic.description"
          @update:model-value="(val: string) => (localBasic.description = val)"
          label="Description"
          placeholder="Short description to help teammates understand the context"
          :error="descriptionError"
          is-required
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
        <WorkshopDifficultySelector :model-value="getBasicInformation.difficulty_level" @update:model-value="updateDifficultyLevels" :options="difficulties" label="Choose difficulty" />
      </div>

      <div class="space-y-2">
        <WorkshopRadioGroup :model-value="getBasicInformation.visibility" @update:model-value="updateVisibility" :options="visabilities" label="Visibility" />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Permissions</label>
        <div class="flex flex-col gap-3 mt-2">
          <label class="flex w-full items-center gap-3 cursor-pointer">
            <input type="checkbox" class="size-5 accent-[#4F46E5] rounded border-gray-300 transition" :checked="getBasicInformation.is_module_only" @change="updateModuleOnly" />
            <span class="text-sm text-gray-800">Module-only flag</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-end border-t border-gray-100 px-6 py-4">
      <button
        type="button"
        class="inline-flex items-center rounded-md px-4 py-2 text-sm text-white bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 transition"
        :disabled="isSubmitting"
        @click="onNext"
      >
        Next
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { workshopStore } from "@/app"
import { WorkshopTextField, TheCountryLanguage, WorkshopSelectField, WorkshopDifficultySelector, WorkshopRadioGroup } from "@/shared/components"
import { IWorkshopSelectFieldOptions, VocabularyFrequencyLevelEnum, WorkshopScenarioTypeEnum, WorkshopVisabilityEnum, type IWorkshopScenarioBasicInformation } from "@/shared/types"
import { DEFAULT_WORKSHOP_SCENARIO_BASIC_INFORMATION } from "@/shared/lib"
import { validatePartial, WorkshopScenarioBasicInformationSchema } from "@/shared/validation"

export default defineComponent({
  name: "BasicInformationSection",
  components: {
    WorkshopTextField,
    TheCountryLanguage,
    WorkshopSelectField,
    WorkshopDifficultySelector,
    WorkshopRadioGroup,
  },

  setup() {
    const scenarioTypeOptions = ref<IWorkshopSelectFieldOptions[]>([
      { label: "Dialog", value: WorkshopScenarioTypeEnum.DIALOG },
      { label: "IELTS", value: WorkshopScenarioTypeEnum.IELTS },
    ])
    const difficulties = Object.values(VocabularyFrequencyLevelEnum)
    const visabilities = Object.values(WorkshopVisabilityEnum)

    const getBasicInformation = computed(() => workshopStore.getBasicInformation)

    const localBasic = ref<IWorkshopScenarioBasicInformation>({
      ...DEFAULT_WORKSHOP_SCENARIO_BASIC_INFORMATION,
      ...getBasicInformation.value,
    })

    const titleError = ref<string>("")
    const descriptionError = ref<string>("")
    const isSubmitting = ref(false)

    const onNext = () => {
      titleError.value = ""
      descriptionError.value = ""

      const { ok, data, errors } = validatePartial(WorkshopScenarioBasicInformationSchema, ["title", "description"] as const, {
        title: localBasic.value.title.trim(),
        description: localBasic.value.description.trim(),
      })

      if (!ok) {
        titleError.value = errors.title ?? ""
        descriptionError.value = errors.description ?? ""
        return
      }

      isSubmitting.value = true
      workshopStore.setBasicInformation({
        title: data.title,
        description: data.description,
      })
      isSubmitting.value = false

      alert("Validation Success")
    }

    const updateTargetLanguage = (value: string) => {
      workshopStore.setBasicInformation({ target_language: value })
    }

    const updateScenarioType = (value: WorkshopScenarioTypeEnum) => {
      workshopStore.setBasicInformation({ scenario_type: value })
    }

    const updateDifficultyLevels = (value: VocabularyFrequencyLevelEnum) => {
      workshopStore.setBasicInformation({ difficulty_level: value })
    }

    const updateVisibility = (value: WorkshopVisabilityEnum) => {
      workshopStore.setBasicInformation({ visibility: value })
    }

    const updateModuleOnly = (event: Event) => {
      workshopStore.setBasicInformation({ is_module_only: (event.target as HTMLInputElement).checked })
    }

    return {
      scenarioTypeOptions,
      difficulties,
      visabilities,
      getBasicInformation,
      localBasic,
      titleError,
      descriptionError,
      isSubmitting,
      onNext,
      updateTargetLanguage,
      updateScenarioType,
      updateDifficultyLevels,
      updateVisibility,
      updateModuleOnly,
    }
  },
})
</script>
