<template>
  <div class="w-full h-full overflow-y-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
    <h3 class="text-2xl font-bold mb-6">{{ getSelectedPrompt?.title }}</h3>

    <p v-if="getSelectedPrompt?.description" class="text-base text-gray-600 mb-10">
      {{ getSelectedPrompt.description }}
    </p>

    <!-- Dictionary Section -->
    <div v-if="getSelectedPrompt?.user_content.dictionary?.length" class="mb-10">
      <h4 class="text-xl font-semibold text-gray-800 mb-4">Dictionary</h4>
      <div v-for="(entry, index) in getSelectedPrompt.user_content.dictionary" :key="'dict-' + index" class="mb-4 p-4 border border-gray-200 rounded-md bg-blue-50/30">
        <p>
          <span class="font-semibold text-gray-700">Word:</span> <span class="text-blue-700 font-medium">{{ entry.word }}</span>
        </p>
        <p><span class="font-semibold text-gray-700">Translation:</span> {{ entry.translation[getUserTranslateLanguage] }}</p>
        <p><span class="font-semibold text-gray-700">Meaning:</span> {{ entry.meaning }}</p>
      </div>
    </div>

    <!-- Phrases Section -->
    <div v-if="getSelectedPrompt?.user_content.phrases?.length" class="mb-10">
      <h4 class="text-xl font-semibold text-gray-800 mb-4">Useful Phrases</h4>
      <div v-for="(entry, index) in getSelectedPrompt.user_content.phrases" :key="'phrase-' + index" class="mb-4 p-4 border border-gray-200 rounded-md bg-yellow-50/30">
        <p>
          <span class="font-semibold text-gray-700">Phrase:</span> <span class="text-yellow-700 font-medium">{{ entry.phrase }}</span>
        </p>
        <p><span class="font-semibold text-gray-700">Translation:</span> {{ entry.translation[getUserTranslateLanguage] }}</p>
        <p><span class="font-semibold text-gray-700">Meaning:</span> {{ entry.meaning }}</p>
      </div>
    </div>

    <!-- Suggestions -->
    <div v-if="getModelTips.length">
      <h4 class="text-xl font-semibold text-gray-800 mb-4">Suggestions</h4>
      <div v-for="(item, index) in getModelTips" :key="index" class="mb-4 p-4 border border-yellow-200 bg-yellow-50 rounded-md text-sm text-yellow-800" v-html="item" />
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
