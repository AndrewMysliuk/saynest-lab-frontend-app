<template>
  <div class="py-10 px-6" v-if="getCurrentReview">
    <h1 class="text-3xl font-bold text-text-base mb-6">
      {{ getCurrentReview.topic_title }}
    </h1>

    <div class="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
      <nav class="flex gap-2 relative after:absolute after:bottom-0 after:inset-x-0 after:border-b after:border-stone-200">
        <button
          @click="activeTab = CommunicationReviewHistoryEnum.GENERAL"
          type="button"
          :class="[
            'px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 text-base rounded-lg focus:outline-hidden after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none',
            activeTab === CommunicationReviewHistoryEnum.GENERAL ? 'text-stone-800 after:bg-stone-800' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800',
          ]"
        >
          Summary
        </button>

        <button
          v-if="getCurrentReview?.error_analysis?.length"
          @click="activeTab = CommunicationReviewHistoryEnum.ERRORS"
          type="button"
          :class="[
            'px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 text-base rounded-lg focus:outline-hidden after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none',
            activeTab === CommunicationReviewHistoryEnum.ERRORS ? 'text-stone-800 after:bg-stone-800' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800',
          ]"
        >
          Mistakes
        </button>

        <button
          @click="activeTab = CommunicationReviewHistoryEnum.DIALOGUE"
          type="button"
          :class="[
            'px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 text-base rounded-lg focus:outline-hidden after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none',
            activeTab === CommunicationReviewHistoryEnum.DIALOGUE ? 'text-stone-800 after:bg-stone-800' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800',
          ]"
        >
          Transcript
        </button>

        <button
          v-if="issueTopics.length"
          @click="activeTab = CommunicationReviewHistoryEnum.TASKS"
          type="button"
          :class="[
            'px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 text-base rounded-lg focus:outline-hidden after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none',
            activeTab === CommunicationReviewHistoryEnum.TASKS ? 'text-stone-800 after:bg-stone-800' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800',
          ]"
        >
          Tasks
        </button>
      </nav>

      <div v-if="activeTab === CommunicationReviewHistoryEnum.GENERAL" class="space-y-10">
        <h2 class="text-2xl font-bold text-gray-800">General Summary</h2>

        <div class="space-y-6">
          <!-- TAGS + SHARE BUTTON -->
          <div class="flex flex-wrap items-center gap-3 text-gray-600">
            <span class="px-3 py-1 bg-purple-100 text-purple-800 text-base font-semibold rounded-md">
              {{ getCurrentReview.target_language }}
            </span>

            <span v-if="getCurrentReview.user_ielts_mark" class="px-3 py-1 bg-blue-100 text-blue-800 text-base font-semibold rounded-md">
              IELTS: {{ getCurrentReview.user_ielts_mark.toFixed(1).replace(".", ",") }}
            </span>

            <span v-else-if="getCurrentReview.user_cefr_level" class="px-3 py-1 bg-green-100 text-green-800 text-base font-semibold rounded-md">
              {{ getCurrentReview.user_cefr_level.level }}
            </span>

            <button @click="generatePublicLink" class="ml-auto inline-flex items-center gap-2 px-3 py-1.5 text-base font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-md transition">
              <i class="fas fa-share-alt text-sm"></i>
              Share
            </button>
          </div>

          <!-- CEFR Grammar Evaluation -->
          <p v-if="getCurrentReview.user_cefr_level" class="italic text-base text-gray-500 mt-3">
            {{ getCurrentReview.user_cefr_level.reasons }}
          </p>

          <!-- Metadata: Date, Time, Messages -->
          <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-4">
            <p><i class="fas fa-calendar-alt mr-1"></i> {{ formatDate(getCurrentReview.created_at) }}</p>
            <p><i class="fas fa-clock mr-1"></i> {{ formatDuration(getCurrentReview.history.duration_seconds) }}</p>
            <p><i class="fas fa-comments mr-1"></i> <b>Messages:</b> {{ getCurrentReview.history.messages.length - 2 }}</p>
            <p><i class="fas fa-user mr-1"></i> <b>You:</b> {{ getCurrentReview.history.user_utterances_count - 1 }}</p>
            <p><i class="fas fa-robot mr-1"></i> <b>AI:</b> {{ getCurrentReview.history.model_utterances_count }}</p>
          </div>

          <!-- SUGGESTIONS -->
          <div v-if="getCurrentReview.suggestion?.length" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <p class="font-semibold text-yellow-800 mb-2"><i class="fas fa-lightbulb mr-2"></i>Suggestion:</p>
            <ul class="list-disc list-inside text-sm text-yellow-900 space-y-1">
              <li v-for="(item, index) in getCurrentReview.suggestion" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- CONCLUSION -->
          <div v-if="getCurrentReview.conclusion" class="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <p class="font-semibold text-green-800 mb-1"><i class="fas fa-check-circle mr-2"></i>Conclusion:</p>
            <p class="text-sm text-green-900">{{ getCurrentReview.conclusion }}</p>
          </div>

          <!-- CONSISTENCY REVIEW -->
          <div
            v-if="getCurrentReview.consistency_review"
            :class="{
              'bg-red-50 border-red-500 text-red-800': getCurrentReview.consistency_review.consistency_score < 40,
              'bg-yellow-50 border-yellow-500 text-yellow-800': getCurrentReview.consistency_review.consistency_score >= 40 && getCurrentReview.consistency_review.consistency_score < 70,
              'bg-green-50 border-green-500 text-green-800': getCurrentReview.consistency_review.consistency_score >= 70,
            }"
            class="border-l-4 p-4 rounded-md"
          >
            <p class="font-semibold mb-1"><i class="fas fa-balance-scale mr-2"></i>Consistency Review:</p>
            <p class="text-sm mb-2">{{ getCurrentReview.consistency_review.summary }}</p>

            <div v-if="getCurrentReview.consistency_review.inconsistent_turns.length > 0" class="mt-2">
              <p class="font-semibold text-sm mb-2">Inconsistencies:</p>
              <ul class="text-sm list-disc pl-5">
                <li v-for="(turn, index) in getCurrentReview.consistency_review.inconsistent_turns" :key="index">
                  <p><strong>Q:</strong> {{ turn.question }}</p>
                  <p><strong>A:</strong> {{ turn.user_response }}</p>
                  <p><strong>Comment:</strong> {{ turn.comment }}</p>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="getCurrentReview.band_breakdown" class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
            <p class="font-semibold text-blue-800 mb-2"><i class="fas fa-chart-bar mr-2"></i>IELTS Band Breakdown:</p>
            <ul class="list-disc list-inside text-sm text-blue-900 space-y-1">
              <li><strong>Fluency & Coherence:</strong> {{ getCurrentReview.band_breakdown.fluency }}</li>
              <li><strong>Lexical Resource:</strong> {{ getCurrentReview.band_breakdown.lexical }}</li>
              <li><strong>Grammatical Range & Accuracy:</strong> {{ getCurrentReview.band_breakdown.grammar }}</li>
            </ul>
          </div>

          <div v-if="getCurrentReview.part1" class="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md">
            <p class="font-semibold text-indigo-800 mb-2"><i class="fas fa-comments mr-2"></i>IELTS Part 1 Feedback:</p>

            <p class="text-sm text-indigo-900 mb-2">
              {{ getCurrentReview.part1.summary }}
            </p>

            <div v-if="getCurrentReview.part1.highlights?.length">
              <p class="font-semibold text-indigo-800 text-sm mb-1">Highlights:</p>
              <ul class="list-disc list-inside text-sm text-indigo-900 space-y-1">
                <li v-for="(item, index) in getCurrentReview.part1.highlights" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <div v-if="getCurrentReview.part2" class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-md">
            <p class="font-semibold text-purple-800 mb-2"><i class="fas fa-microphone mr-2"></i>IELTS Part 2 Feedback:</p>

            <p class="text-sm text-purple-900 mb-2">
              {{ getCurrentReview.part2.summary }}
            </p>

            <div v-if="getCurrentReview.part2.highlights?.length">
              <p class="font-semibold text-purple-800 text-sm mb-1">Highlights:</p>
              <ul class="list-disc list-inside text-sm text-purple-900 space-y-1">
                <li v-for="(item, index) in getCurrentReview.part2.highlights" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <div v-if="getCurrentReview.part3" class="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-md">
            <p class="font-semibold text-pink-800 mb-2"><i class="fas fa-chalkboard-teacher mr-2"></i>IELTS Part 3 Feedback:</p>

            <p class="text-sm text-pink-900 mb-2">
              {{ getCurrentReview.part3.summary }}
            </p>

            <div v-if="getCurrentReview.part3.highlights?.length">
              <p class="font-semibold text-pink-800 text-sm mb-1">Highlights:</p>
              <ul class="list-disc list-inside text-sm text-pink-900 space-y-1">
                <li v-for="(item, index) in getCurrentReview.part3.highlights" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <div v-if="getCurrentReview.goals_coverage?.length" class="mt-8">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">User Goals</h4>
            <ul class="space-y-2">
              <li v-for="goal in getCurrentReview.goals_coverage" :key="goal.goal" class="text-sm leading-relaxed">
                <div class="flex items-center gap-2 text-gray-800">
                  <i :class="goal.is_covered ? 'fas fa-check text-green-600' : 'fas fa-times text-red-500'"></i>
                  <span class="font-medium">{{ goal.goal }}</span>
                </div>
                <div class="ml-6 mt-1 text-sm italic text-gray-500">"{{ goal.quote_from_dialogue || "-" }}"</div>
              </li>
            </ul>
          </div>

          <div v-if="getCurrentReview.vocabulary_used?.length" class="mt-8">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Vocabulary Used</h4>
            <ul class="space-y-2">
              <li v-for="word in getCurrentReview.vocabulary_used" :key="word.word" class="text-sm leading-relaxed">
                <div class="flex items-center gap-2 text-gray-800">
                  <i :class="word.is_used ? 'fas fa-check text-green-600' : 'fas fa-times text-red-500'"></i>
                  <span class="font-medium">{{ word.word }}</span>
                  <span class="text-gray-500">— {{ word.is_used ? "Used" : "Not used" }}</span>
                </div>
                <div class="ml-6 mt-1 text-sm italic text-gray-500">"{{ word.quote_from_dialogue || "-" }}"</div>
              </li>
            </ul>
          </div>

          <div v-if="getCurrentReview.phrases_used?.length" class="mt-8">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Phrases Used</h4>
            <ul class="space-y-2">
              <li v-for="phrase in getCurrentReview.phrases_used" :key="phrase.phrase" class="text-sm leading-relaxed">
                <div class="flex items-center gap-2 text-gray-800">
                  <i :class="phrase.is_used ? 'fas fa-check text-green-600' : 'fas fa-times text-red-500'"></i>
                  <span class="font-medium">{{ phrase.phrase }}</span>
                  <span class="text-gray-500">— {{ phrase.is_used ? "Used" : "Not used" }}</span>
                </div>
                <div class="ml-6 mt-1 text-sm italic text-gray-500">"{{ phrase.quote_from_dialogue || "-" }}"</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="activeTab === CommunicationReviewHistoryEnum.ERRORS && getCurrentReview.error_analysis?.length" class="space-y-10">
        <h2 class="text-2xl font-bold text-gray-800">Mistakes Summary</h2>

        <ul class="space-y-8">
          <li v-for="(analysis, index) in getCurrentReview.error_analysis" :key="index" class="space-y-6 pb-8 border-b-2 border-gray-200 last:border-none">
            <!-- USER MESSAGE -->
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 class="text-sm text-red-700 font-semibold mb-1 flex items-center gap-2"><i class="fas fa-user text-red-500"></i> User Message</h3>
              <p class="text-base font-medium text-gray-800 leading-relaxed">
                {{ analysis.last_user_message }}
              </p>
            </div>

            <!-- ISSUES LIST -->
            <ul class="space-y-5">
              <li v-for="(issue, i) in analysis.issues" :key="i" class="p-4 rounded-lg border border-gray-100 bg-gray-50 text-sm leading-relaxed space-y-2">
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
              </li>
            </ul>

            <!-- IMPROVEMENT -->
            <div class="p-5 bg-green-50 border border-green-200 rounded-lg space-y-2 text-sm text-gray-800">
              <h4 class="font-semibold text-green-700 flex items-center gap-2"><i class="fas fa-brain text-green-600"></i> How to improve?</h4>
              <p><span class="font-semibold">Improved Answer:</span> {{ analysis.improve_user_answer.corrected_text }}</p>
              <p><span class="font-semibold">CEFR Level:</span> {{ analysis.improve_user_answer.cefr_level }}</p>
              <p><span class="font-semibold">Explanation:</span> {{ analysis.improve_user_answer.explanation }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div v-else-if="activeTab === CommunicationReviewHistoryEnum.DIALOGUE && getCurrentReview.history?.messages?.length" class="space-y-8">
        <h2 class="text-2xl font-bold text-text-base">Conversation Transcript</h2>

        <ul class="space-y-4">
          <li
            v-for="(msg, index) in getCurrentReview.history.messages.slice(2)"
            :key="index"
            :class="['rounded-xl p-4 max-w-[85%] shadow-sm', msg.role === 'user' ? 'bg-blue-50 ml-auto' : 'bg-green-50 mr-auto']"
          >
            <!-- Header -->
            <div class="flex items-center justify-between mb-2 text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <i :class="msg.role === 'user' ? 'fas fa-user' : 'fas fa-robot'"></i>
                <span>{{ msg.role === "user" ? "You" : "AI" }}</span>
              </div>
              <span><i class="fas fa-calendar-alt mr-1"></i>{{ formatDate(msg.created_at) }}</span>
            </div>

            <!-- Message Content -->
            <p class="text-gray-800 text-sm leading-relaxed">{{ msg.content }}</p>

            <!-- Audio -->
            <audio v-if="msg.audio_url" class="w-full mt-3 rounded-md" preload="none" :src="msg.audio_url" @error="(e) => handleAudioError(e, msg)" controls />
          </li>
        </ul>
      </div>

      <div v-else-if="activeTab === CommunicationReviewHistoryEnum.TASKS" class="space-y-10">
        <h2 class="text-2xl font-bold text-text-base">Task</h2>

        <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <label for="task-select" class="block text-base font-medium text-gray-700 mb-2"> Select topic: </label>

          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="relative w-full sm:w-auto flex-1">
              <select
                id="task-select"
                v-model="selectedTopic"
                class="w-full appearance-none px-4 pr-10 py-2 text-gray-700 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none bg-white rounded-md"
              >
                <option v-for="topic in issueTopics" :key="topic" :value="topic">
                  {{ topic }}
                </option>
              </select>

              <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <i class="fas fa-chevron-down text-xs"></i>
              </div>
            </div>

            <button class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition" @click="generateTask">
              {{ isLoading ? "Loading..." : "Generate Task" }}
            </button>
          </div>
        </div>

        <TheTask />
      </div>
    </div>

    <v-modal v-model="isPublicLinkModalOpen">
      <PublicLink :public-id="getCurrentReview?.public_id ?? ''" @close="isPublicLinkModalOpen = false" />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeMount, onBeforeUnmount, ref } from "vue"
import { communicationReviewStore, orgStore, promptStore, taskGeneratorStore, userStore } from "@/app"
import { TheTask } from "@/shared/components"
import { formatDuration, formatDate, highlightWords } from "@/shared/lib"
import { CommunicationReviewHistoryEnum, IConversationHistory, TaskModeEnum, TaskTypeEnum } from "@/shared/types"

import PublicLink from "../PublicLink"

export default defineComponent({
  components: {
    PublicLink,
    TheTask,
  },

  setup() {
    const activeTab = ref<CommunicationReviewHistoryEnum>(CommunicationReviewHistoryEnum.GENERAL)
    const isPublicLinkModalOpen = ref<boolean>(false)
    const isLoading = ref<boolean>(false)
    const selectedTopic = ref<string>("")
    const controller = new AbortController()

    onBeforeMount(() => {
      selectedTopic.value = issueTopics.value?.[0] ?? ""
    })

    const getSelectedPrompt = computed(() => promptStore.getCurrentPrompt)
    const getUserTranslateLanguage = computed(() => userStore.getCurrentUser?.explanation_language || "en")
    const getCurrentUser = computed(() => userStore.getCurrentUser)
    const getCurrentReview = computed(() => communicationReviewStore.getCurrentReview)
    const issueTopics = computed(() => {
      if (!getCurrentReview.value) return []

      const topics = getCurrentReview.value.error_analysis
        .flatMap((item) => item.issues?.map((issue) => issue?.topic_titles) || [])
        .filter(Boolean)
        .flat()

      return [...new Set(topics)]
    })

    const generatePublicLink = async () => {
      if (!getCurrentReview.value) return

      if (getCurrentReview.value?.public_id) {
        isPublicLinkModalOpen.value = true
        return
      }

      try {
        await communicationReviewStore.generateReviewPublicId(getCurrentReview.value._id)

        isPublicLinkModalOpen.value = true
      } catch (error: unknown) {
        console.log(error)
      }
    }

    const generateTask = async () => {
      if (!getCurrentReview.value || isLoading.value || !selectedTopic.value) return

      try {
        isLoading.value = true

        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: "TASK_GENERATED",
          scenario_name: getSelectedPrompt.value.name,
          scenario_id: getSelectedPrompt.value._id,
          user_id: getCurrentUser.value?._id,
        })

        if (!Object.keys(getSelectedPrompt.value).length) {
          await promptStore.fetchPromptById(getCurrentReview.value.prompt_id)
        }

        await taskGeneratorStore.fetchTaskGenerator(
          {
            review_id: getCurrentReview.value._id,
            topic_title: selectedTopic.value,
            type: TaskTypeEnum.MULTIPLE_CHOICE,
            mode: TaskModeEnum.WRITE,
            target_language: getSelectedPrompt.value?.meta?.target_language || "",
            explanation_language: getUserTranslateLanguage.value,
            task_sentences_count: 10,
          },
          controller.signal
        )

        orgStore.updateTrialUsage("task")
      } catch (error: unknown) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    const handleAudioError = async (e: Event, msg: IConversationHistory) => {
      const target = e.target as HTMLAudioElement
      const is403 = target?.error?.code === target?.error?.MEDIA_ERR_SRC_NOT_SUPPORTED

      if (is403 && getCurrentReview.value) {
        try {
          await communicationReviewStore.fetchUpdateAudioUrl({
            id: getCurrentReview.value._id,
            session_id: getCurrentReview.value.session_id,
            pair_id: msg.pair_id,
            role: msg.role,
          })

          nextTick(() => {
            target.load()
            target.play().catch((err) => {
              console.warn("Auto-play blocked or failed:", err)
            })
          })
        } catch (err) {
          console.error("Failed to refresh audio URL", err)
        }
      }
    }

    onBeforeUnmount(() => {
      controller.abort()
    })

    return {
      activeTab,
      isLoading,
      selectedTopic,
      isPublicLinkModalOpen,
      getCurrentReview,
      issueTopics,
      handleAudioError,
      generateTask,
      generatePublicLink,
      formatDate,
      formatDuration,
      highlightWords,
      CommunicationReviewHistoryEnum,
    }
  },
})
</script>
