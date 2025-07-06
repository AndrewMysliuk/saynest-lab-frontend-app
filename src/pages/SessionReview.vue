<template>
  <div>
    <TheLoader v-if="!isReady" />

    <div v-else>
      <div class="px-6 py-10" v-if="getPublicReview">
        <h1 class="text-3xl font-bold text-text-base mb-6">
          {{ getPublicReview.topic_title }}
        </h1>

        <div class="bg-stone-50 rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
          <!-- META + TAGS -->
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <span class="bg-gray-200 text-xs text-gray-800 px-2 py-0.5 rounded-full">
              {{ getPublicReview.target_language }}
            </span>
            <span v-if="getPublicReview.user_ielts_mark" class="bg-blue-100 text-xs text-blue-800 font-medium px-2 py-0.5 rounded-full">
              IELTS: {{ getPublicReview.user_ielts_mark.toFixed(1).replace(".", ",") }}
            </span>
            <span v-else-if="getPublicReview.user_cefr_level" class="bg-green-100 text-xs text-green-800 font-medium px-2 py-0.5 rounded-full">
              {{ getPublicReview.user_cefr_level.level }}
            </span>
          </div>

          <!-- EVALUATION TEXT -->
          <p class="italic text-sm text-text-muted" v-if="getPublicReview.user_cefr_level">
            {{ getPublicReview.user_cefr_level.reasons }}
          </p>

          <!-- DATE + METRICS -->
          <div class="flex flex-wrap gap-4 text-xs text-gray-500">
            <p><i class="fas fa-calendar-alt mr-1"></i> {{ formatDate(getPublicReview.created_at) }}</p>
            <p><i class="fas fa-clock mr-1"></i> {{ formatDuration(getPublicReview.history.duration_seconds) }}</p>
            <p><i class="fas fa-comments mr-1"></i> <b>Messages:</b> {{ getPublicReview.history.messages.length - 2 }}</p>
            <p><i class="fas fa-user mr-1"></i> <b>You:</b> {{ getPublicReview.history.user_utterances_count - 1 }}</p>
            <p><i class="fas fa-robot mr-1"></i> <b>AI:</b> {{ getPublicReview.history.model_utterances_count }}</p>
          </div>

          <!-- SUGGESTIONS -->
          <div v-if="getPublicReview.suggestion?.length" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <p class="font-semibold text-yellow-800 mb-2"><i class="fas fa-lightbulb mr-2"></i>Suggestion:</p>
            <ul class="list-disc list-inside text-sm text-yellow-900 space-y-1">
              <li v-for="(item, index) in getPublicReview.suggestion" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- CONCLUSION -->
          <div v-if="getPublicReview.conclusion" class="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <p class="font-semibold text-green-800 mb-1"><i class="fas fa-check-circle mr-2"></i>Conclusion:</p>
            <p class="text-sm text-green-900">{{ getPublicReview.conclusion }}</p>
          </div>

          <!-- CONSISTENCY REVIEW -->
          <div
            v-if="getPublicReview.consistency_review"
            :class="{
              'bg-red-50 border-red-500 text-red-800': getPublicReview.consistency_review.consistency_score < 40,
              'bg-yellow-50 border-yellow-500 text-yellow-800': getPublicReview.consistency_review.consistency_score >= 40 && getPublicReview.consistency_review.consistency_score < 70,
              'bg-green-50 border-green-500 text-green-800': getPublicReview.consistency_review.consistency_score >= 70,
            }"
            class="border-l-4 p-4 rounded-md"
          >
            <p class="font-semibold mb-1"><i class="fas fa-balance-scale mr-2"></i>Consistency Review:</p>
            <p class="text-sm mb-2">{{ getPublicReview.consistency_review.summary }}</p>

            <div v-if="getPublicReview.consistency_review.inconsistent_turns.length > 0" class="mt-2">
              <p class="font-semibold text-sm mb-1">Inconsistencies:</p>
              <ul class="text-xs list-disc pl-5">
                <li v-for="(turn, index) in getPublicReview.consistency_review.inconsistent_turns" :key="index">
                  <p><strong>Q:</strong> {{ turn.question }}</p>
                  <p><strong>A:</strong> {{ turn.user_response }}</p>
                  <p><strong>Comment:</strong> {{ turn.comment }}</p>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="getPublicReview.band_breakdown" class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
            <p class="font-semibold text-blue-800 mb-2"><i class="fas fa-chart-bar mr-2"></i>IELTS Band Breakdown:</p>
            <ul class="list-disc list-inside text-sm text-blue-900 space-y-1">
              <li><strong>Fluency & Coherence:</strong> {{ getPublicReview.band_breakdown.fluency }}</li>
              <li><strong>Lexical Resource:</strong> {{ getPublicReview.band_breakdown.lexical }}</li>
              <li><strong>Grammatical Range & Accuracy:</strong> {{ getPublicReview.band_breakdown.grammar }}</li>
            </ul>
          </div>

          <div v-if="getPublicReview.part1" class="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md">
            <p class="font-semibold text-indigo-800 mb-2"><i class="fas fa-comments mr-2"></i>IELTS Part 1 Feedback:</p>

            <p class="text-sm text-indigo-900 mb-2">
              {{ getPublicReview.part1.summary }}
            </p>

            <div v-if="getPublicReview.part1.highlights?.length">
              <p class="font-semibold text-indigo-800 text-sm mb-1">Highlights:</p>
              <ul class="list-disc list-inside text-sm text-indigo-900 space-y-1">
                <li v-for="(item, index) in getPublicReview.part1.highlights" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <div v-if="getPublicReview.part2" class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-md">
            <p class="font-semibold text-purple-800 mb-2"><i class="fas fa-microphone mr-2"></i>IELTS Part 2 Feedback:</p>

            <p class="text-sm text-purple-900 mb-2">
              {{ getPublicReview.part2.summary }}
            </p>

            <div v-if="getPublicReview.part2.highlights?.length">
              <p class="font-semibold text-purple-800 text-sm mb-1">Highlights:</p>
              <ul class="list-disc list-inside text-sm text-purple-900 space-y-1">
                <li v-for="(item, index) in getPublicReview.part2.highlights" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <div v-if="getPublicReview.part3" class="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-md">
            <p class="font-semibold text-pink-800 mb-2"><i class="fas fa-chalkboard-teacher mr-2"></i>IELTS Part 3 Feedback:</p>

            <p class="text-sm text-pink-900 mb-2">
              {{ getPublicReview.part3.summary }}
            </p>

            <div v-if="getPublicReview.part3.highlights?.length">
              <p class="font-semibold text-pink-800 text-sm mb-1">Highlights:</p>
              <ul class="list-disc list-inside text-sm text-pink-900 space-y-1">
                <li v-for="(item, index) in getPublicReview.part3.highlights" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <div v-if="getPublicReview.goals_coverage?.length" class="mt-8">
            <h4 class="text-lg font-semibold text-text-base mb-4">User Goals</h4>
            <ul class="space-y-3">
              <li v-for="goal in getPublicReview.goals_coverage" :key="goal.goal" class="text-sm">
                <div class="flex items-center gap-2">
                  <i :class="goal.is_covered ? 'fas fa-check text-green-600' : 'fas fa-times text-red-500'"></i>
                  <span class="font-medium">{{ goal.goal }}</span>
                </div>
                <div v-if="goal.quote_from_dialogue" class="ml-6 italic text-text-muted">
                  {{ goal.quote_from_dialogue }}
                </div>
              </li>
            </ul>
          </div>

          <div v-if="getPublicReview.vocabulary_used?.length" class="mt-8">
            <h4 class="text-lg font-semibold text-text-base mb-4">Vocabulary Used</h4>
            <ul class="space-y-3">
              <li v-for="word in getPublicReview.vocabulary_used" :key="word.word" class="text-sm">
                <div class="flex items-center gap-2">
                  <i :class="word.is_used ? 'fas fa-check text-green-600' : 'fas fa-times text-red-500'"></i>
                  <span class="font-medium">{{ word.word }}</span>
                  <span class="text-gray-500">— {{ word.is_used ? "Used" : "Not used" }}</span>
                </div>
                <div v-if="word.quote_from_dialogue" class="ml-6 italic text-text-muted">
                  {{ word.quote_from_dialogue }}
                </div>
              </li>
            </ul>
          </div>

          <div v-if="getPublicReview.phrases_used?.length" class="mt-8">
            <h4 class="text-lg font-semibold text-text-base mb-4">Phrases Used</h4>
            <ul class="space-y-3">
              <li v-for="phrase in getPublicReview.phrases_used" :key="phrase.phrase" class="text-sm">
                <div class="flex items-center gap-2">
                  <i :class="phrase.is_used ? 'fas fa-check text-green-600' : 'fas fa-times text-red-500'"></i>
                  <span class="font-medium">{{ phrase.phrase }}</span>
                  <span class="text-gray-500">— {{ phrase.is_used ? "Used" : "Not used" }}</span>
                </div>
                <div v-if="phrase.quote_from_dialogue" class="ml-6 italic text-text-muted">
                  {{ phrase.quote_from_dialogue }}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <div class="flex justify-center mt-8 space-x-2">
            <button
              v-if="getPublicReview?.error_analysis?.length"
              @click="activeTab = 'ERRORS'"
              :class="['px-4 py-2 rounded-full text-sm font-medium transition', activeTab === 'ERRORS' ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
            >
              Mistakes
            </button>
          </div>

          <div class="mt-8 bg-stone-50 rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
            <div v-if="activeTab === 'ERRORS' && getPublicReview.error_analysis?.length" class="space-y-10">
              <h2 class="text-2xl font-bold text-text-base">Mistakes Summary</h2>

              <ul class="space-y-8">
                <li v-for="(analysis, index) in getPublicReview.error_analysis" :key="index" class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm space-y-6">
                  <!-- User Message -->
                  <div class="bg-gray-50 p-4 rounded-md border-l-4 border-red-500">
                    <h3 class="text-sm text-gray-500 mb-1">User Message</h3>
                    <p class="text-md font-medium text-gray-800 leading-relaxed">{{ analysis.last_user_message }}</p>
                  </div>

                  <!-- Issues -->
                  <ul class="space-y-5">
                    <li v-for="(issue, i) in analysis.issues" :key="i" class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div class="text-sm space-y-1 leading-relaxed">
                        <p>
                          <span class="font-semibold text-gray-600">Original:</span>
                          <span class="ml-1" v-html="highlightWords(issue.original_text, issue.error_words, 'error')" />
                        </p>
                        <p>
                          <span class="font-semibold text-gray-600">Suggestion:</span>
                          <span class="ml-1" v-html="highlightWords(issue.corrected_text, issue.corrected_words, 'correct')" />
                        </p>
                        <p class="text-gray-700"><span class="font-semibold">Explanation:</span> {{ issue.explanation }}</p>
                        <p v-if="issue.topic_titles" class="text-gray-600"><span class="font-semibold">Topic:</span> {{ issue.topic_titles.join(", ") }}</p>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { communicationReviewStore } from "@/app"
import { formatDuration, formatDate, highlightWords } from "@/shared/lib"
import { TheLoader } from "@/shared/components"

export default defineComponent({
  components: {
    TheLoader,
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const isReady = ref<boolean>(false)
    const publicId = route.params.public_id as string | undefined
    const activeTab = ref<"ERRORS">("ERRORS")

    if (!publicId) {
      router.replace({ name: "index" })
    }

    const getPublicReview = computed(() => communicationReviewStore.getPublicReview)

    onBeforeMount(async () => {
      await fetchPublicReview()

      isReady.value = true
    })

    const fetchPublicReview = async () => {
      try {
        if (!publicId) throw new Error("publicId is undefined")

        await communicationReviewStore.fetchReviewByPublicId(publicId)
      } catch (error: unknown) {
        console.log(error)

        router.replace({ name: "index" })
      }
    }

    return {
      isReady,
      activeTab,
      getPublicReview,
      formatDate,
      formatDuration,
      highlightWords,
    }
  },
})
</script>
