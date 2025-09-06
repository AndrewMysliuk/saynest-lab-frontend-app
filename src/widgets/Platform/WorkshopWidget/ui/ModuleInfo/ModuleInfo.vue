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
        <WorkshopTextField :model-value="getModuleInfo.title" @update:model-value="updateTitle" label="Title" placeholder="Module title" :error="titleError" is-required />
      </div>

      <div class="space-y-2 md:col-span-2">
        <WorkshopTextField
          :model-value="getModuleInfo.description"
          @update:model-value="updateDescription"
          label="Description"
          placeholder="Short summary of what this module covers"
          :error="descriptionError"
          is-required
          is-multiline
          :rows="3"
        />
      </div>

      <div class="space-y-2">
        <WorkshopTagInput :model-value="getModuleInfo.tags" @update:model-value="updateTags" :suggestions="tagSuggestions" label="Tags" placeholder="Add tag and press Enter" :error="tagsError" />
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
import { ModuleInfoSchema } from "@/shared/validation"
import { validatePartial } from "@/shared/validation/utils"

export default defineComponent({
  name: "ModuleInfo",

  components: {
    WorkshopTextField,
    WorkshopTagInput,
    WorkshopRadioGroup,
  },

  setup() {
    const isSubmitting = ref(false)
    const tagSuggestions = ref<string[]>(["interview", "travel", "money", "health", "small talk"])
    const visabilities = Object.values(ModuleTypeEnum)
    const titleError = ref<string>("")
    const descriptionError = ref<string>("")
    const tagsError = ref<string>("")

    const getModuleInfo = computed(() => workshopStore.getModuleInfo)

    const updateTitle = (value: string) => {
      titleError.value = ""
      workshopStore.setModuleInfo({ title: value })
    }

    const updateDescription = (value: string) => {
      descriptionError.value = ""
      workshopStore.setModuleInfo({ description: value })
    }

    const updateVisibility = (value: ModuleTypeEnum) => {
      workshopStore.setModuleInfo({ type: value })
    }

    const updateTags = (value: string[]) => {
      tagsError.value = ""
      workshopStore.setModuleInfo({ tags: value })
    }

    const onNext = () => {
      titleError.value = ""
      descriptionError.value = ""
      tagsError.value = ""

      const { ok, data, errors } = validatePartial(ModuleInfoSchema, ["title", "description", "tags"] as const, {
        title: getModuleInfo.value.title.trim(),
        description: getModuleInfo.value.description.trim(),
        tags: getModuleInfo.value.tags,
      })

      if (!ok) {
        titleError.value = errors.title ?? ""
        descriptionError.value = errors.description ?? ""
        tagsError.value = errors.tags ?? ""
        return
      }

      isSubmitting.value = true
      workshopStore.setModuleInfo({
        title: data.title,
        description: data.description,
        tags: data.tags,
      })
      isSubmitting.value = false

      alert("Validation Success")
    }

    return {
      visabilities,
      isSubmitting,
      getModuleInfo,
      tagSuggestions,
      titleError,
      descriptionError,
      tagsError,
      updateTitle,
      updateDescription,
      updateVisibility,
      updateTags,
      onNext,
    }
  },
})
</script>
