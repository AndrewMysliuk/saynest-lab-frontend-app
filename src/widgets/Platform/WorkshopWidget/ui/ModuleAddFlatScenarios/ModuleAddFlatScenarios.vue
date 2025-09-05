<template>
  <section class="rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
    <!-- Header -->
    <div class="flex items-start justify-between border-b border-gray-100 px-6 py-5">
      <div>
        <h2 class="text-base font-semibold">Add Scenarios</h2>
        <p class="text-sm text-slate-500 mt-2">Select scenarios and order them for this module.</p>
      </div>
      <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Scenarios Settings</span>
    </div>

    <!-- Body -->
    <div class="p-6">
      <div class="space-y-4">
        <div class="text-sm text-slate-600">Choose scenarios from the catalog. Click to toggle selection. Reorder the selected items.</div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div class="mb-2 text-sm font-medium">Catalog</div>
            <div class="space-y-2">
              <!-- <div v-for="s in scenariosCatalog" :key="s.id" class="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-md bg-gray-50 flex items-center justify-center text-xs text-slate-600">SC</div>
                  <div class="text-sm">{{ s.title }}</div>
                </div>
                <div>
                  <button
                    @click="toggleSelectScenario(s.id)"
                    :class="['rounded-md px-3 py-1 text-sm', moduleState.selectedScenarios.includes(s.id) ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-slate-700']"
                  >
                    {{ moduleState.selectedScenarios.includes(s.id) ? "Selected" : "Select" }}
                  </button>
                </div>
              </div> -->
            </div>
          </div>

          <div>
            <div class="mb-2 text-sm font-medium">Selected & order</div>
            <!-- <div v-if="!moduleState.selectedScenarios.length" class="text-sm text-slate-500">No scenarios selected</div>
            <div class="space-y-2">
              <div v-for="(id, i) in moduleState.selectedScenarios" :key="id" class="flex items-center justify-between rounded-lg bg-gray-50 p-2 ring-1 ring-gray-200">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center text-xs text-slate-600">#{{ i + 1 }}</div>
                  <div class="text-sm">{{ scenariosCatalog.find((x) => x.id === id)?.title ?? id }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button class="btn-link text-sm" @click="moveSelectedScenarioUp(i)" :disabled="i === 0">Up</button>
                  <button class="btn-link text-sm" @click="moveSelectedScenarioDown(i)" :disabled="i === moduleState.selectedScenarios.length - 1">Down</button>
                  <button class="btn-link text-red-600 text-sm" @click="toggleSelectScenario(id)">Remove</button>
                </div>
              </div>
            </div> -->
          </div>
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

export default defineComponent({
  name: "ModuleAddFlatScenarios",

  components: {},

  setup() {
    const isSubmitting = ref<boolean>(false)

    const getModuleScenariosFlat = computed(() => workshopStore.getModuleScenariosFlat)

    const onNext = () => {
      // TODO
    }

    return {
      isSubmitting,
      getModuleScenariosFlat,
      onNext,
    }
  },
})
</script>
