<template>
  <div class="analyser">
    <div v-if="isLoading" class="loader-container">
      <div class="loader" />
    </div>

    <div class="analyser__container" v-else-if="Object.keys(getGptAnalyserResult).length">
      <h2>Analysis Results</h2>

      <!-- Confidence Section -->
      <div class="analyser__section">
        <h3>Confidence</h3>
        <p><strong>Score:</strong> {{ getGptAnalyserResult.confidence.score }}</p>
        <div v-if="getGptAnalyserResult.confidence.examples.length">
          <h4>Problems</h4>
          <ul>
            <li v-for="(example, index) in getGptAnalyserResult.confidence.examples" :key="'confidence-example-' + index">
              {{ example }}
            </li>
          </ul>
        </div>
        <div v-if="getGptAnalyserResult.confidence.suggestions.length">
          <h4>Suggestions</h4>
          <ul>
            <li v-for="(suggestion, index) in getGptAnalyserResult.confidence.suggestions" :key="'confidence-suggestion-' + index">
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Coherence Section -->
      <div class="analyser__section">
        <h3>Coherence</h3>
        <p><strong>Score:</strong> {{ getGptAnalyserResult.coherence.score }}</p>
        <div v-if="getGptAnalyserResult.coherence.examples.length">
          <h4>Problems</h4>
          <ul>
            <li v-for="(example, index) in getGptAnalyserResult.coherence.examples" :key="'coherence-example-' + index">
              {{ example }}
            </li>
          </ul>
        </div>
        <div v-if="getGptAnalyserResult.coherence.suggestions.length">
          <h4>Suggestions</h4>
          <ul>
            <li v-for="(suggestion, index) in getGptAnalyserResult.coherence.suggestions" :key="'coherence-suggestion-' + index">
              {{ suggestion }}
            </li>
          </ul>
        </div>
        <div v-if="getGptAnalyserResult.coherence.corrected_sentence?.length">
          <h4>Corrected Sentences</h4>
          <ul>
            <li>
              {{ getGptAnalyserResult.coherence.corrected_sentence }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Grammar Section -->
      <div class="analyser__section">
        <h3>Grammar</h3>
        <p><strong>Summary:</strong> {{ getGptAnalyserResult.grammar.summary }}</p>
        <div v-if="getGptAnalyserResult.grammar.errors.length">
          <h4>Problems</h4>
          <ul>
            <li v-for="(error, index) in getGptAnalyserResult.grammar.errors" :key="'grammar-error-' + index">
              <p>
                <strong>User Phrase: </strong>
                <span v-html="highlightIncorrectParts(error.original, error.highlighted.incorrect_parts)" />
              </p>
              <p>
                <strong>Corrected Sentence: </strong>
                <span class="corrected">{{ error.corrected_sentence }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Vocabulary Section -->
      <div class="analyser__section">
        <h3>Vocabulary</h3>
        <p><strong>Total Active Words:</strong> {{ getGptAnalyserResult.vocabulary.active_vocab.total }}</p>
        <p><strong>Evaluation:</strong> {{ getGptAnalyserResult.vocabulary.active_vocab.evaluation }}</p>
        <div v-if="getGptAnalyserResult.vocabulary.unique_words.list.length">
          <h4>Unique Words</h4>
          <p><strong>Count:</strong> {{ getGptAnalyserResult.vocabulary.unique_words.count }}</p>
          <ul>
            <li v-for="(word, index) in getGptAnalyserResult.vocabulary.unique_words.list" :key="'vocabulary-unique-' + index">
              {{ word }}
            </li>
          </ul>
        </div>
        <div v-if="getGptAnalyserResult.vocabulary.rare_words.examples.length">
          <h4>Rare Words</h4>
          <p><strong>Percentage:</strong> {{ getGptAnalyserResult.vocabulary.rare_words.percentage }}</p>
          <ul>
            <li v-for="(word, index) in getGptAnalyserResult.vocabulary.rare_words.examples" :key="'vocabulary-rare-' + index">
              {{ word }}
            </li>
          </ul>
        </div>
        <div>
          <h4>Word Samples by Level</h4>
          <div v-for="(level, key) in getGptAnalyserResult.vocabulary.word_sample_by_level" :key="'vocabulary-level-' + key">
            <div v-if="level.words.length && level.synonyms.length">
              <h5>Level {{ key }}</h5>
              <p><strong>Words:</strong> {{ level.words.join(", ") }}</p>
              <p><strong>Synonyms:</strong> {{ level.synonyms.join(", ") }}</p>
            </div>
          </div>
        </div>
        <div v-if="getGptAnalyserResult.vocabulary.suggestions.length">
          <h4>Suggestions</h4>
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
import { defineComponent, ref, computed, onBeforeMount, nextTick } from "vue"
import { useRouter } from "vue-router"
import { sendboxStore } from "@/app"
import { analyzeConversationPrompt, analyzeConversationJsonSchema } from "@/shared/utils"

export default defineComponent({
  setup() {
    const router = useRouter()
    const isLoading = ref<boolean>(true)

    const getConversationHistory = computed(() => sendboxStore.getConversationResponse.conversation_history.filter((item) => item.role !== "system"))
    const getGptAnalyserResult = computed(() => sendboxStore.getGptAnalyserResult)

    onBeforeMount(async () => {
      if (!getConversationHistory.value.length) {
        nextTick(() => {
          router.push({ name: "sendbox.prompts" })
        })
      } else {
        await conversationAnalyser()
      }
    })

    const conversationAnalyser = async () => {
      try {
        isLoading.value = true

        await sendboxStore.fetchConversationAnalyserByGptModel({
          model: "gpt-4o-mini",
          max_tokens: 1000,
          messages: [
            {
              role: "system",
              content: analyzeConversationPrompt,
            },
            {
              role: "user",
              content: JSON.stringify(getConversationHistory.value),
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

    return {
      isLoading,
      getGptAnalyserResult,
      highlightIncorrectParts,
    }
  },
})
</script>
