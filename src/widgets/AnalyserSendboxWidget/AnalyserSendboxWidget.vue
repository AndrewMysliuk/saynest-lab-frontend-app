<template>
  <div class="analyser">
    <div v-if="isLoading" class="analyser__loader">
      <div class="analyser__loader-spin" />
    </div>

    <div class="analyser__container" v-else-if="Object.keys(getGptAnalyserResult).length">
      <h2 class="analyser__container-title">Analysis Results</h2>

      <!-- Grammar Section -->
      <div class="analyser__section">
        <h3 class="analyser__section-title">Grammar</h3>
        <p class="analyser__section-paragraph"><strong>Summary:</strong> {{ getGptAnalyserResult.grammar.summary }}</p>

        <div class="analyser__section-row" v-if="getGptAnalyserResult.grammar.errors?.length">
          <h4 class="analyser__section-subtitle">Problems</h4>
          <ul>
            <li v-for="(error, index) in getGptAnalyserResult.grammar.errors" :key="'grammar-error-' + index">
              <p class="analyser__section-paragraph">
                <strong>User Phrase: </strong>
                <span v-html="highlightIncorrectParts(error.original, error.highlighted.incorrect_parts)" />
              </p>
              <p class="analyser__section-paragraph">
                <strong>Corrected Sentence: </strong>
                <span class="corrected">{{ error.corrected_sentence }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Coherence Section -->
      <div class="analyser__section">
        <h3 class="analyser__section-title">Coherence</h3>
        <div class="analyser__section-wrapper">
          <div class="analyser__section-row" v-if="getGptAnalyserResult.coherence.examples?.length">
            <h4 class="analyser__section-subtitle">Problems</h4>
            <ul>
              <li v-for="(example, index) in getGptAnalyserResult.coherence.examples" :key="'coherence-example-' + index">
                {{ example }}
              </li>
            </ul>
          </div>
          <div class="analyser__section-row" v-if="getGptAnalyserResult.coherence.suggestions?.length">
            <h4 class="analyser__section-subtitle">Suggestions</h4>
            <ul>
              <li v-for="(suggestion, index) in getGptAnalyserResult.coherence.suggestions" :key="'coherence-suggestion-' + index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
          <div class="analyser__section-row" v-if="getGptAnalyserResult.coherence.corrected_sentence?.length">
            <h4 class="analyser__section-subtitle">Corrected Sentences</h4>
            <ul>
              <li>
                {{ getGptAnalyserResult.coherence.corrected_sentence }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Confidence Section -->
      <div class="analyser__section">
        <h3 class="analyser__section-title">Confidence</h3>
        <div class="analyser__section-wrapper">
          <div class="analyser__section-row" v-if="getGptAnalyserResult.confidence.examples?.length">
            <h4 class="analyser__section-subtitle">Problems</h4>
            <ul>
              <li v-for="(example, index) in getGptAnalyserResult.confidence.examples" :key="'confidence-example-' + index">
                {{ example }}
              </li>
            </ul>
          </div>
          <div class="analyser__section-row" v-if="getGptAnalyserResult.confidence.suggestions?.length">
            <h4 class="analyser__section-subtitle">Suggestions</h4>
            <ul>
              <li v-for="(suggestion, index) in getGptAnalyserResult.confidence.suggestions" :key="'confidence-suggestion-' + index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Vocabulary Section -->
      <div class="analyser__section">
        <h3 class="analyser__section-title">Vocabulary</h3>
        <p class="analyser__section-paragraph"><strong>Total Active Words:</strong> {{ getGptAnalyserResult.vocabulary.active_vocab.total }}</p>

        <p class="analyser__section-paragraph"><strong>Evaluation:</strong> {{ getGptAnalyserResult.vocabulary.active_vocab.evaluation }}</p>

        <div class="analyser__section-row" v-if="getGptAnalyserResult.vocabulary.unique_words.list?.length">
          <h4 class="analyser__section-subtitle">Unique Words</h4>
          <p class="analyser__section-paragraph"><strong>Count:</strong> {{ getGptAnalyserResult.vocabulary.unique_words.count }}</p>
          <p class="analyser__section-paragraph">
            {{ getGptAnalyserResult.vocabulary.unique_words.list.join(", ") }}
          </p>
        </div>

        <div class="analyser__section-row" v-if="getGptAnalyserResult.vocabulary.rare_words.examples?.length">
          <h4 class="analyser__section-subtitle">Rare Words</h4>
          <p class="analyser__section-paragraph"><strong>Percentage:</strong> {{ getGptAnalyserResult.vocabulary.rare_words.percentage }}</p>
          <p class="analyser__section-paragraph">
            {{ getGptAnalyserResult.vocabulary.rare_words.examples.join(", ") }}
          </p>
        </div>

        <div class="analyser__section-row">
          <h4 class="analyser__section-subtitle">Word Samples by Level</h4>
          <div v-for="(level, key) in getGptAnalyserResult.vocabulary.word_sample_by_level" :key="'vocabulary-level-' + key">
            <div v-if="level.words?.length && level.synonyms?.length">
              <h5>Level {{ key }}</h5>
              <p><strong>Words:</strong> {{ level.words.join(", ") }}</p>
              <p><strong>Synonyms:</strong> {{ level.synonyms.join(", ") }}</p>
            </div>
          </div>
        </div>

        <div class="analyser__section-row" v-if="getGptAnalyserResult.vocabulary.suggestions?.length">
          <h4 class="analyser__section-subtitle">Suggestions</h4>
          <ul>
            <li v-for="(suggestion, index) in getGptAnalyserResult.vocabulary.suggestions" :key="'vocabulary-suggestion-' + index">
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onBeforeMount, nextTick, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { sendboxStore } from "@/app"
import { analyzeConversationPrompt, analyzeConversationJsonSchema } from "@/shared/utils"

export default defineComponent({
  setup() {
    const router = useRouter()
    const isLoading = ref<boolean>(true)

    const getGptAnalyserResult = computed(() => sendboxStore.getGptAnalyserResult)

    onBeforeMount(async () => {
      if (!localStorage.getItem("last_conversation_history")) {
        nextTick(() => {
          router.push({ name: "sendbox.prompts" })
        })
      } else if (localStorage.getItem("last_saved_analyse")) {
        sendboxStore.parseLastSavedAnalyse()

        isLoading.value = false
      } else {
        await conversationAnalyser()
      }
    })

    const conversationAnalyser = async () => {
      try {
        isLoading.value = true

        await sendboxStore.fetchConversationAnalyserByGptModel({
          model: "gpt-4o-mini",
          max_tokens: 10000,
          messages: [
            {
              role: "system",
              content: analyzeConversationPrompt,
            },
            {
              role: "user",
              content: localStorage.getItem("last_conversation_history") ?? "",
            },
          ],
          jsonSchema: analyzeConversationJsonSchema,
        })
      } catch (error: unknown) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    const highlightIncorrectParts = (original: string, incorrectParts: string[]): string => {
      let highlightedText = original

      incorrectParts.forEach((part) => {
        const regex = new RegExp(`(${part})`, "gi")
        highlightedText = highlightedText.replace(regex, `<span class="highlight">$1</span>`)
      })

      return highlightedText
    }

    onBeforeUnmount(() => {
      localStorage.removeItem("last_saved_analyse")
    })

    return {
      isLoading,
      getGptAnalyserResult,
      highlightIncorrectParts,
    }
  },
})
</script>
