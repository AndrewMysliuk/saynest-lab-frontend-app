<template>
  <section class="rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-5">
      <div>
        <h2 class="text-base font-semibold">Scenario Content</h2>
        <p class="text-sm text-slate-500 mt-2">User content and scenario behavior</p>
      </div>
      <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Interactive</span>
    </div>
    <div class="grid grid-cols-1 gap-6 p-6">
      <div class="space-y-4">
        <WorkshopCollapsibleList
          :user-goals="getScenarioContent.user_goals"
          :user-dictionary="getScenarioContent.user_dictionary"
          :user-phrases="getScenarioContent.user_phrases"
          @update:user-goals="updateUserGoals"
          @update:user-dictionary="updateUserDictionary"
          @update:user-phrases="updateUserPhrases"
        />
      </div>

      <div class="space-y-4">
        <div v-if="!isDialog" class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-medium">Dialog behavior</h3>
            <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Type: Dialog</span>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <WorkshopTextField
              :model-value="getScenarioContent.dialog_behavior.setting"
              @update:model-value="updateDialogSetting"
              label="Describe Dialog Location"
              placeholder="e.g. Hotel reception"
            />

            <WorkshopTextField
              :model-value="getScenarioContent.dialog_behavior.situation"
              @update:model-value="updateDialogSituation"
              label="Describe Model Role"
              placeholder="e.g. You are a hotel receptionist"
            />

            <WorkshopTextField
              :model-value="getScenarioContent.dialog_behavior.goal"
              @update:model-value="updateDialogGoal"
              label="Describe Model Goal"
              placeholder="e.g. Simulate a full hotel check-in experience"
            />
          </div>

          <WorkshopDialogSteps :model-value="getScenarioContent.dialog_behavior.steps" @update:model-value="updateDialogSteps" />
        </div>

        <div v-else class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-medium">IELTS structure</h3>
            <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Type: IELTS</span>
          </div>

          <WorkshopIELTSBehavior :model-value="getScenarioContent.ielts_behavior" @update:model-value="updateIeltsBehavior" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { workshopStore } from "@/app"
import { WorkshopCollapsibleList, WorkshopTextField, WorkshopDialogSteps, WorkshopIELTSBehavior } from "@/shared/components"
import { IDictionaryEntry, IIELTSScenarioDetails, IPhraseEntry, IPromptGoal, WorkshopScenarioTypeEnum } from "@/shared/types"

export default defineComponent({
  components: {
    WorkshopCollapsibleList,
    WorkshopTextField,
    WorkshopDialogSteps,
    WorkshopIELTSBehavior,
  },

  setup() {
    const getScenarioContent = computed(() => workshopStore.getScenarioContent)
    const isDialog = computed(() => workshopStore.getBasicInformation?.scenario_type === WorkshopScenarioTypeEnum.DIALOG)

    const updateUserGoals = (value: IPromptGoal[]) => {
      workshopStore.setScenarioContent({
        user_goals: value,
      })
    }

    const updateUserDictionary = (value: IDictionaryEntry[]) => {
      workshopStore.setScenarioContent({
        user_dictionary: value,
      })
    }

    const updateUserPhrases = (value: IPhraseEntry[]) => {
      workshopStore.setScenarioContent({
        user_phrases: value,
      })
    }

    const updateDialogSetting = (value: string) => {
      workshopStore.setScenarioContent({
        dialog_behavior: {
          ...getScenarioContent.value.dialog_behavior,
          setting: value,
        },
      })
    }

    const updateDialogSituation = (value: string) => {
      workshopStore.setScenarioContent({
        dialog_behavior: {
          ...getScenarioContent.value.dialog_behavior,
          situation: value,
        },
      })
    }

    const updateDialogGoal = (value: string) => {
      workshopStore.setScenarioContent({
        dialog_behavior: {
          ...getScenarioContent.value.dialog_behavior,
          goal: value,
        },
      })
    }

    const updateDialogSteps = (value: string[]) => {
      workshopStore.setScenarioContent({
        dialog_behavior: {
          ...getScenarioContent.value.dialog_behavior,
          steps: value,
        },
      })
    }

    const updateIeltsBehavior = (value: IIELTSScenarioDetails) => {
      workshopStore.setScenarioContent({
        ielts_behavior: value,
      })
    }

    return {
      getScenarioContent,
      isDialog,
      updateUserGoals,
      updateUserDictionary,
      updateUserPhrases,
      updateDialogSetting,
      updateDialogSituation,
      updateDialogGoal,
      updateDialogSteps,
      updateIeltsBehavior,
    }
  },
})
</script>
