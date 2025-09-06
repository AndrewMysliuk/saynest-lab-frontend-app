<template>
  <section class="rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
    <!-- Header -->
    <div class="flex items-start justify-between border-b border-gray-100 px-6 py-5">
      <div>
        <h2 class="text-base font-semibold">Metadata & Actions</h2>
        <p class="text-sm text-slate-500 mt-2">Runtime limits and behavior</p>
      </div>
    </div>

    <!-- Body -->
    <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      <div class="md:col-span-2 space-y-2">
        <WorkshopTextField
          :model-value="localMetadata.model_end_behavior"
          @update:model-value="(val: string) => (localMetadata.model_end_behavior = val)"
          label="Model end behavior / closing phrase"
          placeholder="e.g. Great job! Let's wrap up."
          :error="errorMessage"
          is-required
        />
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
import { defineComponent, ref } from "vue"
import { workshopStore } from "@/app"
import { WorkshopTextField } from "@/shared/components"
import { DEFAULT_WORKSHOP_SCENARIO_METADATA_ACTIONS } from "@/shared/lib"
import { WorkshopScenarioMetadataActionsSchema } from "@/shared/validation"
import type { IWorkshopScenarioMetadataActions } from "@/shared/types"

export default defineComponent({
  name: "MetadataActionsSection",

  components: { WorkshopTextField },

  setup() {
    const current = workshopStore.getMetadataActions ?? DEFAULT_WORKSHOP_SCENARIO_METADATA_ACTIONS
    const localMetadata = ref<IWorkshopScenarioMetadataActions>({
      ...DEFAULT_WORKSHOP_SCENARIO_METADATA_ACTIONS,
      ...current,
    })

    const errorMessage = ref<string>("")
    const isSubmitting = ref(false)

    const onNext = () => {
      const result = WorkshopScenarioMetadataActionsSchema.safeParse(localMetadata.value)
      if (!result.success) {
        errorMessage.value = result.error.issues[0]?.message ?? "Invalid value"
        return
      }

      errorMessage.value = ""
      isSubmitting.value = true
      workshopStore.setMetadataActions(result.data)
      isSubmitting.value = false

      alert("Validation Success")
    }

    return {
      localMetadata,
      errorMessage,
      isSubmitting,
      onNext,
    }
  },
})
</script>
