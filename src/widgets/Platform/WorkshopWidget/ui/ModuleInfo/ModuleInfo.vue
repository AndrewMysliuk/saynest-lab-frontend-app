<template>
  <section class="rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
    <!-- Header -->
    <div class="flex items-start justify-between border-b border-gray-100 px-6 py-5">
      <div>
        <h2 class="text-base font-semibold">Module Info</h2>
        <p class="text-sm text-slate-500 mt-2">Create a module that groups scenarios into a single learning unit</p>
      </div>
      <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Basic Settings</span>
    </div>

    <!-- Body -->
    <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      <div class="space-y-2 md:col-span-2">
        <WorkshopTextField :model-value="getModuleInfo.title" @update:model-value="updateTitle" label="Title" placeholder="Module title" is-required />
      </div>

      <div class="space-y-2 md:col-span-2">
        <WorkshopTextField
          :model-value="getModuleInfo.description"
          @update:model-value="updateDescription"
          label="Description"
          placeholder="Short summary of what this module covers"
          is-required
          is-multiline
          :rows="3"
        />
      </div>

      <div class="space-y-2">
        <WorkshopTagInput :model-value="getModuleInfo.tags" @update:model-value="updateTags" :suggestions="tagSuggestions" label="Tags" placeholder="Add tag and press Enter" />
      </div>

      <div class="space-y-2">
        <WorkshopRadioGroup :model-value="getModuleInfo.type" @update:model-value="updateVisibility" :options="visabilities" label="Type" />
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
import { WorkshopTagInput, WorkshopRadioGroup, WorkshopTextField } from "@/shared/components"
import { ModuleTypeEnum } from "@/shared/types"

export default defineComponent({
  name: "ModuleInfo",

  components: {
    WorkshopTextField,
    WorkshopTagInput,
    WorkshopRadioGroup,
  },

  setup() {
    const isSubmitting = ref<boolean>(false)
    const tagSuggestions = ref<string[]>(["interview", "travel", "money", "health", "small talk"])
    const visabilities = Object.values(ModuleTypeEnum)

    const getModuleInfo = computed(() => workshopStore.getModuleInfo)

    const updateTitle = (value: string) => {
      workshopStore.setModuleInfo({
        title: value,
      })
    }

    const updateDescription = (value: string) => {
      workshopStore.setModuleInfo({
        description: value,
      })
    }

    const updateVisibility = (value: ModuleTypeEnum) => {
      workshopStore.setModuleInfo({ type: value })
    }

    const updateTags = (value: string[]) => {
      workshopStore.setModuleInfo({
        tags: value,
      })
    }

    const onNext = () => {
      // TODO
    }

    return {
      visabilities,
      isSubmitting,
      getModuleInfo,
      tagSuggestions,
      updateTitle,
      updateDescription,
      updateVisibility,
      updateTags,
      onNext,
    }
  },
})
</script>
