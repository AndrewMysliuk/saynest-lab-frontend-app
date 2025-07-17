<template>
  <div class="w-full h-full overflow-y-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
    <div class="flex justify-between items-center relative mb-6 md:block">
      <h3 class="text-xl font-semibold text-gray-800">{{ getSelectedPrompt?.title }}</h3>

      <!-- Close Button -->
      <div class="md:absolute md:top-0 md:end-0 md:z-10">
        <button
          @click="$emit('close')"
          type="button"
          class="size-8 shrink-0 flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
        >
          <span class="sr-only">Close</span>
          <svg
            class="shrink-0 size-6"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <!-- End Close Button -->
    </div>

    <p v-if="getSelectedPrompt?.description" class="text-base text-gray-600 mb-10">
      {{ getSelectedPrompt.description }}
    </p>

    <!-- Dictionary Section -->
    <div v-if="getSelectedPrompt?.user_content.dictionary?.length" class="mb-10">
      <h4 class="text-xl font-semibold text-gray-800 mb-4">Dictionary</h4>
      <div
        v-for="(entry, index) in getSelectedPrompt.user_content.dictionary"
        :key="'dict-' + index"
        class="mb-4 p-4 border border-gray-200 rounded-md bg-gradient-to-br from-blue-50 via-white to-blue-50/40"
      >
        <p>
          <span class="font-semibold text-gray-700">Word: </span>
          <span class="text-blue-700 font-medium">{{ entry.word }}</span>
        </p>
        <p>
          <span class="font-semibold text-gray-700">Translation: </span>
          {{ entry.translation[getUserTranslateLanguage] }}
        </p>
        <p>
          <span class="font-semibold text-gray-700">Meaning: </span>
          {{ entry.meaning }}
        </p>
      </div>
    </div>

    <!-- Phrases Section -->
    <div v-if="getSelectedPrompt?.user_content.phrases?.length" class="mb-10">
      <h4 class="text-xl font-semibold text-gray-800 mb-4">Useful Phrases</h4>
      <div
        v-for="(entry, index) in getSelectedPrompt.user_content.phrases"
        :key="'phrase-' + index"
        class="mb-4 p-4 border border-gray-200 rounded-md bg-gradient-to-br from-yellow-50 via-white to-yellow-50/40"
      >
        <p>
          <span class="font-semibold text-gray-700">Phrase: </span>
          <span class="text-yellow-700 font-medium">{{ entry.phrase }}</span>
        </p>
        <p>
          <span class="font-semibold text-gray-700">Translation: </span>
          {{ entry.translation[getUserTranslateLanguage] }}
        </p>
        <p>
          <span class="font-semibold text-gray-700">Meaning: </span>
          {{ entry.meaning }}
        </p>
      </div>
    </div>

    <!-- Suggestions -->
    <div v-if="getModelTips.length">
      <h4 class="text-xl font-semibold text-gray-800 mb-4">Suggestions</h4>
      <div
        v-for="(item, index) in getModelTips"
        :key="index"
        class="mb-4 p-4 border border-green-200 rounded-md bg-gradient-to-br from-green-50 via-white to-green-50/40 text-sm text-green-800"
        v-html="item"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { promptStore, errorAnalysisStore, userStore } from "@/app"

export default defineComponent({
  setup() {
    const getSelectedPrompt = computed(() => promptStore.getCurrentPrompt)
    const getModelTips = computed(() => errorAnalysisStore.getModelTips)
    const getUserTranslateLanguage = computed(() => userStore.getCurrentUser?.explanation_language || "en")

    return {
      getSelectedPrompt,
      getModelTips,
      getUserTranslateLanguage,
    }
  },
})
</script>
