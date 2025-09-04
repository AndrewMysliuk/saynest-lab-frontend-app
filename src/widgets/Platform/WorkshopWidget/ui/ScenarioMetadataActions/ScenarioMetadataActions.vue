<template>
  <section class="max-w-4xl rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-5">
      <div>
        <h2 class="text-base font-semibold">Metadata & Actions</h2>
        <p class="text-sm text-slate-500 mt-2">Runtime limits and behavior</p>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      <div class="space-y-2">
        <WorkshopTextField
          :mask-options="{
            mask: '99',
            placeholder: '',
            showMaskOnHover: false,
            showMaskOnFocus: false,
            jitMasking: true,
          }"
          :model-value="getMetadataActions.estimated_duration_minutes"
          @update:model-value="updateEstimateMinutes"
          label="Estimated duration (minutes)"
          placeholder="e.g. 10"
        />
      </div>

      <div class="space-y-2">
        <WorkshopTextField
          :mask-options="{
            mask: '99',
            placeholder: '',
            showMaskOnHover: false,
            showMaskOnFocus: false,
            jitMasking: true,
          }"
          :model-value="getMetadataActions.max_turns"
          @update:model-value="updateMaxTurns"
          label="Max turns"
          placeholder="e.g. 8"
        />
      </div>

      <div class="md:col-span-2 space-y-2">
        <WorkshopTextField
          :model-value="getMetadataActions.model_end_behavior"
          @update:model-value="updateModelBehavior"
          label="Model end behavior / closing phrase"
          placeholder="e.g. Great job! Let's wrap up."
        />
      </div>

      <div class="space-y-2">
        <WorkshopTextField
          :mask-options="{
            mask: '99',
            placeholder: '',
            showMaskOnHover: false,
            showMaskOnFocus: false,
            jitMasking: true,
          }"
          :model-value="getMetadataActions.question_count_range.min"
          @update:model-value="updateRangeMin"
          label="Question count (min)"
          placeholder="min"
        />
      </div>

      <div class="space-y-2">
        <WorkshopTextField
          :mask-options="{
            mask: '99',
            placeholder: '',
            showMaskOnHover: false,
            showMaskOnFocus: false,
            jitMasking: true,
          }"
          :model-value="getMetadataActions.question_count_range.max"
          @update:model-value="updateRangeMax"
          label="Question count (max)"
          placeholder="max"
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">IELTS scenario</label>

        <div class="flex flex-col gap-3 mt-2">
          <label class="flex w-full items-center gap-3 cursor-pointer">
            <input type="checkbox" class="size-5 accent-[#4F46E5] rounded border-gray-300 transition" :checked="getMetadataActions.is_ielts" @change="updateIeltsType" />
            <span class="text-sm text-gray-800">Mark as IELTS</span>
          </label>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { workshopStore } from "@/app"
import { WorkshopTextField } from "@/shared/components"

export default defineComponent({
  components: {
    WorkshopTextField,
  },

  setup() {
    const getMetadataActions = computed(() => workshopStore.getMetadataActions)

    const updateEstimateMinutes = (value: string) => {
      workshopStore.setMetadataActions({
        estimated_duration_minutes: value,
      })
    }

    const updateMaxTurns = (value: string) => {
      workshopStore.setMetadataActions({
        max_turns: value,
      })
    }

    const updateModelBehavior = (value: string) => {
      workshopStore.setMetadataActions({
        model_end_behavior: value,
      })
    }

    const updateRangeMin = (value: string) => {
      workshopStore.setMetadataActions({
        question_count_range: {
          min: value,
          max: getMetadataActions.value.question_count_range.max,
        },
      })
    }

    const updateRangeMax = (value: string) => {
      workshopStore.setMetadataActions({
        question_count_range: {
          min: getMetadataActions.value.question_count_range.min,
          max: value,
        },
      })
    }

    const updateIeltsType = (event: Event) => {
      workshopStore.setMetadataActions({
        is_ielts: (event.target as HTMLInputElement).checked,
      })
    }

    return {
      getMetadataActions,
      updateEstimateMinutes,
      updateMaxTurns,
      updateModelBehavior,
      updateRangeMin,
      updateRangeMax,
      updateIeltsType,
    }
  },
})
</script>
