<template>
  <div class="prompt__modal">
    <div class="prompt__modal-scroll">
      <h3 class="prompt__modal-title">{{ getSelectedPrompt?.title }}</h3>

      <br /><br />

      <p class="prompt__modal-desc" v-if="getSelectedPrompt?.description">
        {{ getSelectedPrompt?.description }}
      </p>

      <br /><br />

      <div v-if="getModelTips.length">
        <h4>Helpful Tips</h4>

        <div class="prompt__modal-separator" v-for="(item, index) in getModelTips" :key="index">
          <div class="conversation__warning --flexible" v-html="item" />
        </div>
      </div>

      <br /><br />

      <div v-if="getRecomendedWords.length">
        <h4>Recommended Vocabulary</h4>

        <br />

        <div class="prompt__modal-word" v-for="(entry, index) in getRecomendedWords" :key="index">
          <p><strong>Word:</strong> {{ entry.word }}</p>

          <div v-for="(meaning, idx) in entry.meanings" :key="idx" class="prompt__modal-meaning">
            <p><strong>Translation:</strong> {{ meaning.translation }}</p>
            <p><strong>Meaning:</strong> {{ meaning.meaning }}</p>

            <div v-if="meaning.synonyms?.length" class="prompt__modal-synonyms">
              <p><strong>Synonyms:</strong></p>
              <div class="prompt__modal-synonyms-list">
                <span v-for="(syn, sidx) in meaning.synonyms" :key="sidx" class="prompt__modal-synonym">
                  {{ syn }}
                </span>
              </div>
            </div>

            <br />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { promptStore, errorAnalysisStore, vocabularyTrackerStore } from "@/app"

export default defineComponent({
  setup() {
    const getSelectedPrompt = computed(() => promptStore.getSelectedPrompt)
    const getModelTips = computed(() => errorAnalysisStore.getModelTips)
    const getRecomendedWords = computed(() => vocabularyTrackerStore.getRecomendedWords)

    return {
      getSelectedPrompt,
      getModelTips,
      getRecomendedWords,
    }
  },
})
</script>
