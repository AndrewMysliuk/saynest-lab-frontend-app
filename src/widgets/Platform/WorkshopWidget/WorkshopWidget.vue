<template>
  <div class="flex-grow min-h-0 bg-gray-50">
    <TheLoader v-if="getIsPageLoading" />

    <div v-else class="pt-16 max-w-[1720px] w-full mx-auto">
      <div class="py-10 px-6">
        <h1 class="text-3xl font-bold text-text-base mb-6">Workshop</h1>

        <div class="space-y-4">
          <!-- <ScenarioBasicInformation /> -->

          <ScenarioContent />

          <!-- <ScenarioMetadataActions /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { commonStore } from "@/app"
import { TheLoader } from "@/shared/components"
import { ScenarioBasicInformation, ScenarioContent, ScenarioMetadataActions } from "./ui"

export default defineComponent({
  components: {
    TheLoader,
    // ScenarioBasicInformation,
    ScenarioContent,
    // ScenarioMetadataActions,
  },

  setup() {
    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)

    return {
      getIsPageLoading,
    }
  },
})
</script>
