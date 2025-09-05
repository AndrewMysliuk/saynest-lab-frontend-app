<template>
  <section class="rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
    <!-- Header -->
    <div class="flex items-start justify-between border-b border-gray-100 px-6 py-5">
      <div>
        <h2 class="text-base font-semibold">Define Complex Scenarios</h2>
        <p class="text-sm text-slate-500 mt-2">Select scenarios and order them for this module.</p>
      </div>
      <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Scenarios Settings</span>
    </div>

    <!-- Body -->
    <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">TODO</div>

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

export default defineComponent({
  name: "ModuleAddComplexScenarios",

  components: {},

  setup() {
    const isSubmitting = ref<boolean>(false)

    const getModuleStructureComplex = computed(() => workshopStore.getModuleStructureComplex)

    const onNext = () => {
      // TODO
    }

    return {
      isSubmitting,
      getModuleStructureComplex,
      onNext,
    }
  },
})
</script>
