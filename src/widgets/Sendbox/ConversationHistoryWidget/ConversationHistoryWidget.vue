<template>
  <div>
    <div class="history --loader" v-if="!isReady">
      <div class="conversation__description">
        <span class="--pulse" />
        <p>Please Stand By...</p>
      </div>
    </div>

    <div v-else>
      <div class="history" v-if="isSingle && getCurrentReview">
        <h1 class="history__title">{{ getCurrentReview.topic_title }}</h1>

        <div class="history__item --no-cursor">
          <div class="history__item-info">
            <div class="history__item-meta">
              <span class="history__badge">{{ getCurrentReview.language }}</span>
              <span class="history__badge history__badge--level">{{ getCurrentReview.user_cefr_level.level }}</span>
            </div>

            <p class="history__level-reason">{{ getCurrentReview.user_cefr_level.reasons }}</p>

            <div class="history__item-details">
              <p><i class="fas fa-calendar-alt"></i> {{ formatDate(getCurrentReview.created_at) }}</p>
              <p><i class="fas fa-clock"></i> {{ formatDuration(getCurrentReview.history.duration_seconds) }}</p>
              <p><i class="fas fa-comments"></i> <b>Messages:</b> {{ getCurrentReview.history.messages.length - 1 }}</p>
              <p><i class="fas fa-user"></i> <b>You:</b> {{ getCurrentReview.history.user_utterances_count }}</p>
              <p><i class="fas fa-robot"></i> <b>AI:</b> {{ getCurrentReview.history.model_utterances_count }}</p>
            </div>

            <br />

            <div>
              <div class="history__highlight">
                <div class="history__item-details" v-if="getCurrentReview.suggestion?.length">
                  <p><i class="fas fa-lightbulb"></i> <b>Suggestion: </b></p>
                  <ul class="suggestion-list">
                    <li v-for="(item, index) in getCurrentReview.suggestion" :key="index">
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="history__highlight" v-if="getCurrentReview.conclusion">
                <div class="history__item-details">
                  <p><i class="fas fa-check-circle"></i> <b>Conclusion: </b> {{ getCurrentReview.conclusion }}</p>
                </div>
              </div>
            </div>

            <br />

            <!-- User Goals -->
            <div class="history__goals" v-if="getCurrentReview.goals_coverage?.length">
              <h4 class="history__section-title">User Goals</h4>
              <ul>
                <li v-for="goal in getCurrentReview.goals_coverage" :key="goal.goal">
                  <div class="goal-line">
                    <i :class="goal.is_covered ? 'fas fa-check text-green' : 'fas fa-times text-red'"></i>
                    <b>{{ goal.goal }}</b>
                  </div>
                  <div class="goal-evidence" v-if="goal.quote_from_dialogue">
                    {{ goal.quote_from_dialogue }}
                  </div>
                </li>
              </ul>
            </div>

            <br />

            <!-- Vocabulary Used -->
            <div class="history__vocab-used" v-if="getCurrentReview.vocabulary_used?.length">
              <h4 class="history__section-title">Vocabulary Used</h4>
              <ul>
                <li v-for="word in getCurrentReview.vocabulary_used" :key="word.word">
                  <div class="used-line">
                    <i :class="word.is_used ? 'fas fa-check text-green' : 'fas fa-times text-red'"></i>
                    <b>{{ word.word }}</b>
                    <span>— {{ word.is_used ? "Used" : "Not used" }}</span>
                  </div>
                  <div class="used-context" v-if="word.quote_from_dialogue">
                    {{ word.quote_from_dialogue }}
                  </div>
                </li>
              </ul>
            </div>

            <br />

            <!-- Phrases Used -->
            <div class="history__phrases" v-if="getCurrentReview.phrases_used?.length">
              <h4 class="history__section-title">Phrases Used</h4>
              <ul>
                <li v-for="phrase in getCurrentReview.phrases_used" :key="phrase.phrase">
                  <div class="used-line">
                    <i :class="phrase.is_used ? 'fas fa-check text-green' : 'fas fa-times text-red'"></i>
                    <b>{{ phrase.phrase }}</b>
                    <span>— {{ phrase.is_used ? "Used" : "Not used" }}</span>
                  </div>
                  <div class="used-context" v-if="phrase.quote_from_dialogue">
                    {{ phrase.quote_from_dialogue }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="history__tabs-wrapper">
          <div class="history__tabs">
            <button :class="{ active: activeTab === 'errors' }" @click="activeTab = 'errors'">Mistakes</button>
            <button :class="{ active: activeTab === 'vocab' }" @click="activeTab = 'vocab'">Vocabulary</button>
            <button :class="{ active: activeTab === 'dialogue' }" @click="activeTab = 'dialogue'">Conversation</button>
          </div>

          <div class="history__tab-content">
            <div v-if="activeTab === 'errors'">
              <div class="history__errors" v-if="getCurrentReview.error_analysis?.length">
                <h2 class="history__errors-title">Mistakes Summary</h2>

                <ul class="history__errors-list">
                  <li v-for="(analysis, index) in getCurrentReview.error_analysis" :key="index" class="history__error-group">
                    <h3 class="history__error-message">
                      User Message: <b>{{ analysis.last_user_message }}</b>
                    </h3>

                    <h3 class="history__error-message">
                      How to improve: <b>{{ analysis.improve_user_answer }}</b>
                    </h3>

                    <ul class="history__issue-list">
                      <li v-for="(issue, i) in analysis.issues" :key="i" class="history__issue">
                        <p>
                          <strong>💬 Original: </strong>
                          <span v-html="highlightWords(issue.original_text, issue.error_words, 'error')"></span>
                        </p>

                        <p>
                          <strong>✨ Suggestion: </strong>
                          <span v-html="highlightWords(issue.corrected_text, issue.corrected_words, 'correct')"></span>
                        </p>
                        <p><strong>💡 Explanation:</strong> {{ issue.explanation }}</p>
                        <p v-if="issue.topic_titles"><strong>🏷 Topic:</strong> {{ issue.topic_titles }}</p>
                      </li>
                    </ul>

                    <p v-if="analysis.suggestion_message" class="history__issue-summary"><i class="fas fa-comment-alt"></i> {{ analysis.suggestion_message }}</p>
                  </li>
                </ul>
              </div>
            </div>

            <div v-else-if="activeTab === 'vocab'">
              <div class="history__vocab" v-if="getCurrentReview.vocabulary?.length">
                <h2 class="history__vocab-title">Vocabulary Highlights</h2>

                <ul class="history__vocab-list">
                  <li v-for="(word, i) in getCurrentReview.vocabulary" :key="i" class="history__vocab-item">
                    <div class="history__vocab-header">
                      <div style="display: flex; align-items: center; gap: 8px">
                        <b>User said: </b>
                        <span class="history__vocab-word">{{ word.word }} </span>
                        <span class="history__badge history__badge--level"> {{ word.frequency_level }}</span>
                      </div>
                      <div>
                        <b>Synonyms: </b>
                        <span class="history__vocab-word" style="margin-left: auto">({{ word.meanings?.[0].synonyms.join(", ") }})</span>
                      </div>
                    </div>

                    <ul class="history__meaning-list">
                      <li v-for="(meaning, j) in word.meanings" :key="j" class="history__meaning">
                        <p><strong>Part of Speech:</strong> {{ meaning.part_of_speech }}</p>
                        <p><strong>Translation:</strong> {{ meaning.translation }}</p>
                        <p><strong>Meaning:</strong> {{ meaning.meaning }}</p>
                        <!-- <p v-if="meaning.synonyms?.length"><strong>Synonyms:</strong> {{ meaning.synonyms.join(", ") }}</p> -->
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

            <div v-else-if="activeTab === 'dialogue'">
              <div class="history__dialogue" v-if="getCurrentReview.history?.messages?.length">
                <h2 class="history__dialogue-title">Conversation</h2>

                <ul class="history__dialogue-list">
                  <li v-for="(msg, index) in getCurrentReview.history.messages.slice(2)" :key="index" :class="['history__message', msg.role === 'user' ? 'user' : 'assistant']">
                    <div class="history__message-header">
                      <span class="history__role">
                        <i :class="msg.role === 'user' ? 'fas fa-user' : 'fas fa-robot'"></i>
                        {{ msg.role === "user" ? "You" : "AI" }}
                      </span>
                      <p><i class="fas fa-calendar-alt"></i> {{ formatDate(msg.created_at) }}</p>
                    </div>

                    <p class="history__message-content">{{ msg.content }}</p>

                    <audio v-if="msg.audio_url" class="history__audio" :src="`${VITE_API_CORE_URL}${msg.audio_url}`" controls />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="history" v-else>
        <h1 class="history__title">Conversation History</h1>

        <div class="history__content" v-if="getReviewsList.length">
          <ul class="history__list">
            <li v-for="review in getReviewsList" :key="review._id" class="history__item" @click="openDetails(review)">
              <div class="history__item-info">
                <h2 class="history__item-title">{{ review.topic_title }}</h2>

                <div class="history__item-meta">
                  <span class="history__badge">{{ review.language }}</span>
                  <span class="history__badge history__badge--level">{{ review.user_cefr_level.level }}</span>
                </div>

                <p class="history__level-reason">{{ review.user_cefr_level.reasons }}</p>

                <div class="history__item-details">
                  <p><i class="fas fa-calendar-alt"></i> {{ formatDate(review.created_at) }}</p>
                  <p><i class="fas fa-clock"></i> {{ formatDuration(review.history.duration_seconds) }}</p>
                  <p><i class="fas fa-comments"></i> Messages: {{ review.history.messages.length - 1 }}</p>
                </div>
              </div>

              <div class="history__item-actions">
                <button @click.prevent.stop="openDetails(review)" class="history__action-btn" title="View">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click.prevent.stop="deleteReview(review._id)" class="history__action-btn" title="Delete">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </li>
          </ul>
        </div>

        <p v-else class="history__empty">You don't have any conversation review</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { communicationReviewStore } from "@/app"
import { useRoute, useRouter } from "vue-router"
import { IStatistics, IWord } from "@/shared/types"
import { defineComponent, onBeforeMount, computed, ref } from "vue"

const VITE_API_CORE_URL: string = import.meta.env.VITE_API_CORE_URL

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isReady = ref(false)
    const activeTab = ref<"errors" | "vocab" | "dialogue">("errors")

    const isSingle = computed(() => !!route.params.id)
    const getReviewsList = computed(() => communicationReviewStore.getReviewsList)
    const getCurrentReview = computed(() => communicationReviewStore.getCurrentReview)

    onBeforeMount(async () => {
      if (!getCurrentReview.value) {
        router.push({
          name: "sendbox.conversation-history",
        })
      }

      if (!getReviewsList.value.length) {
        await setupOnloadMethods()
      }

      isReady.value = true
    })

    const setupOnloadMethods = async () => {
      try {
        await communicationReviewStore.fetchReviewsList()
      } catch (error) {
        console.error("Error in setupOnloadMethods:", error)
      }
    }

    const formatDate = (date: Date | string) => {
      return new Date(date).toLocaleString()
    }

    const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}m ${secs}s`
    }

    const openDetails = (review: IStatistics) => {
      communicationReviewStore.setCurrentReview(review)

      router.push({
        name: "sendbox.conversation-history",
        params: { id: review._id },
      })
    }

    const deleteReview = async (id: string) => {
      try {
        await communicationReviewStore.fetchDeleteReviewById(id)
      } catch (error) {
        console.error("Error deleting review:", error)
      }
    }

    const highlightWords = (text: string, words: IWord[], type: "error" | "correct") => {
      if (!words?.length) return text

      const uniqueWords = [...new Set(words.map((w) => w.value))]
      const escapedWords = uniqueWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      const regex = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi")

      return text.replace(regex, (match) => {
        const cls = type === "error" ? "highlight-error" : "highlight-correct"
        return `<span class="${cls}">${match}</span>`
      })
    }

    return {
      isReady,
      isSingle,
      activeTab,
      getReviewsList,
      getCurrentReview,
      formatDate,
      formatDuration,
      openDetails,
      deleteReview,
      highlightWords,
      VITE_API_CORE_URL,
    }
  },
})
</script>
