<template>
  <div class="prompt__modal">
    <div class="prompt__modal-scroll">
      <h3 class="prompt__modal-title">{{ getSelectedPrompt?.title }}</h3>

      <br /><br />

      <p class="prompt__modal-desc" v-if="getSelectedPrompt?.description">
        {{ getSelectedPrompt?.description }}
      </p>

      <v-button label="Start Conversation" button-style="info" @click="$router.push({ name: 'sendbox.conversation' })" />

      <br /><br />

      <!-- Dictionary Section -->
      <div v-if="getSelectedPrompt?.dictionary?.length">
        <h4>Dictionary</h4>
        <br />

        <div class="prompt__modal-word" v-for="(entry, index) in getSelectedPrompt.dictionary" :key="'dict-' + index">
          <p><strong>Word:</strong> {{ entry.word }}</p>
          <p><strong>Translation:</strong> {{ entry.translation }}</p>
          <p><strong>Meaning:</strong> {{ entry.meaning }}</p>
        </div>
      </div>

      <br /><br />

      <!-- Phrases Section -->
      <div v-if="getSelectedPrompt?.phrases?.length">
        <h4>Phrases</h4>
        <br />

        <div class="prompt__modal-word" v-for="(entry, index) in getSelectedPrompt.phrases" :key="'phrase-' + index">
          <p><strong>Phrase:</strong> {{ entry.phrase }}</p>
          <p><strong>Translation:</strong> {{ entry.translation }}</p>
          <p><strong>Meaning:</strong> {{ entry.meaning }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { promptStore, errorAnalysisStore } from "@/app"

export default defineComponent({
  setup() {
    const getSelectedPrompt = computed(() => promptStore.getSelectedPrompt)
    const getModelTips = computed(() => errorAnalysisStore.getModelTips)

    return {
      getSelectedPrompt,
      getModelTips,
    }
  },
})
</script>
