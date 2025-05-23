<template>
  <div>
    <TheLoader v-if="!isReady || getIsPageLoading" />

    <div class="pt-16" v-else>
      <div class="px-6 py-10" v-if="isSingle && getCurrentReview">
        <h1 class="text-3xl font-bold text-text-base mb-6">
          {{ getCurrentReview.topic_title }}
        </h1>

        <div class="bg-stone-50 rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
          <!-- META + TAGS -->
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <span class="bg-gray-200 text-xs text-gray-800 px-2 py-0.5 rounded-full">
              {{ getCurrentReview.target_language }}
            </span>
            <span class="bg-green-100 text-xs text-green-800 font-medium px-2 py-0.5 rounded-full">
              {{ getCurrentReview.user_cefr_level.level }}
            </span>
          </div>

          <!-- EVALUATION TEXT -->
          <p class="italic text-sm text-text-muted">
            {{ getCurrentReview.user_cefr_level.reasons }}
          </p>

          <!-- DATE + METRICS -->
          <div class="flex flex-wrap gap-4 text-xs text-gray-500">
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

          <div v-if="getCurrentReview.goals_coverage?.length" class="mt-8">
            <h4 class="text-lg font-semibold text-text-base mb-4">User Goals</h4>
            <ul class="space-y-3">
              <li v-for="goal in getCurrentReview.goals_coverage" :key="goal.goal" class="text-sm">
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

          <div v-if="getCurrentReview.vocabulary_used?.length" class="mt-8">
            <h4 class="text-lg font-semibold text-text-base mb-4">Vocabulary Used</h4>
            <ul class="space-y-3">
              <li v-for="word in getCurrentReview.vocabulary_used" :key="word.word" class="text-sm">
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

          <div v-if="getCurrentReview.phrases_used?.length" class="mt-8">
            <h4 class="text-lg font-semibold text-text-base mb-4">Phrases Used</h4>
            <ul class="space-y-3">
              <li v-for="phrase in getCurrentReview.phrases_used" :key="phrase.phrase" class="text-sm">
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
              @click="activeTab = 'ERRORS'"
              :class="['px-4 py-2 rounded-full text-sm font-medium transition', activeTab === 'ERRORS' ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
            >
              Mistakes
            </button>

            <button
              v-if="getCurrentReview.vocabulary?.length"
              @click="activeTab = 'VOCAB'"
              :class="['px-4 py-2 rounded-full text-sm font-medium transition', activeTab === 'VOCAB' ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
            >
              Repeated Words
            </button>

            <button
              @click="activeTab = 'DIALOGUE'"
              :class="['px-4 py-2 rounded-full text-sm font-medium transition', activeTab === 'DIALOGUE' ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
            >
              Conversation
            </button>

            <button
              v-if="issueTopics.length"
              @click="activeTab = 'TASKS'"
              :class="['px-4 py-2 rounded-full text-sm font-medium transition', activeTab === 'TASKS' ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
            >
              Tasks
            </button>
          </div>

          <div class="mt-8 bg-stone-50 rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
            <div v-if="activeTab === 'ERRORS' && getCurrentReview.error_analysis?.length" class="space-y-10">
              <h2 class="text-2xl font-bold text-text-base">Mistakes Summary</h2>

              <ul class="space-y-8">
                <li v-for="(analysis, index) in getCurrentReview.error_analysis" :key="index" class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm space-y-6">
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

                  <!-- Improvement -->
                  <div class="bg-green-50 border border-green-200 rounded-lg p-5 space-y-2 text-sm text-gray-800">
                    <h4 class="font-semibold text-text-base">How to improve?</h4>
                    <p><span class="font-semibold">Improved Answer:</span> {{ analysis.improve_user_answer.corrected_text }}</p>
                    <p><span class="font-semibold">CEFR Level:</span> {{ analysis.improve_user_answer.cefr_level }}</p>
                    <p><span class="font-semibold">Explanation:</span> {{ analysis.improve_user_answer.explanation }}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div v-else-if="activeTab === 'VOCAB' && getCurrentReview.vocabulary?.length" class="space-y-10">
              <h2 class="text-2xl font-bold text-text-base">Vocabulary Highlights</h2>

              <ul class="grid sm:grid-cols-2 gap-6">
                <li v-for="(word, i) in getCurrentReview.vocabulary" :key="i" class="bg-white border border-gray-200 rounded-xl p-6 space-y-5 shadow-sm">
                  <!-- Word Header -->
                  <div class="flex items-center justify-between">
                    <div class="text-lg font-semibold text-gray-800">
                      User said: <span class="text-blue-600">{{ word.word }}</span>
                    </div>
                    <span class="text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5 font-medium">{{ word.frequency_level }}</span>
                  </div>

                  <!-- Synonyms -->
                  <div>
                    <p class="text-sm text-gray-600">
                      <strong>Synonyms: </strong>
                      <span class="text-blue-700 font-medium">{{ word.meanings?.[0]?.synonyms?.join(", ") || "—" }}</span>
                    </p>
                    <p class="text-sm text-gray-600 mt-1"><strong>Repeated: </strong> {{ word.repeated_count }} times</p>
                  </div>

                  <!-- Meaning Box -->
                  <div class="bg-blue-50 border border-blue-100 rounded-md px-4 py-3 space-y-2 text-sm text-gray-800">
                    <template v-for="(meaning, j) in word.meanings" :key="j">
                      <p><strong class="text-gray-700">Part of Speech:</strong> {{ meaning.part_of_speech }}</p>
                      <p><strong class="text-gray-700">Translation:</strong> {{ meaning.translation }}</p>
                      <p><strong class="text-gray-700">Meaning:</strong> {{ meaning.meaning }}</p>
                    </template>
                  </div>
                </li>
              </ul>
            </div>

            <div v-else-if="activeTab === 'DIALOGUE' && getCurrentReview.history?.messages?.length" class="space-y-8">
              <h2 class="text-2xl font-bold text-text-base">Conversation</h2>

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

            <div v-else-if="activeTab === 'TASKS'" class="space-y-10">
              <TheTask />

              <div class="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <label for="task-select" class="block font-medium text-gray-700 mb-2">Select topic:</label>
                <div class="flex gap-3">
                  <select id="task-select" v-model="selectedTopic" class="flex-1 border border-gray-300 rounded-md px-4 py-2 text-gray-700">
                    <option v-for="topic in issueTopics" :key="topic" :value="topic">
                      {{ topic }}
                    </option>
                  </select>
                  <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primaryDark transition" @click="generateTask">
                    {{ isLoading ? "Loading..." : "Generate Task" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 py-10" v-else>
        <h1 class="text-3xl font-bold text-text-base mb-8">Conversation History</h1>

        <div v-if="getReviewsList.length" class="space-y-6">
          <div
            v-for="review in getReviewsList"
            :key="review._id"
            @click="openDetails(review)"
            class="bg-stone-50 hover:bg-stone-100 transition-colors duration-200 rounded-xl p-6 border border-stone-200 shadow-sm cursor-pointer relative"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h2 class="text-lg font-semibold text-gray-800 mb-2">
                  {{ review.topic_title }}
                </h2>

                <div class="flex items-center gap-2 mb-3">
                  <span class="bg-gray-200 text-xs text-gray-800 px-2 py-0.5 rounded-full">
                    {{ review.target_language }}
                  </span>
                  <span class="bg-green-100 text-xs text-green-800 font-medium px-2 py-0.5 rounded-full">
                    {{ review.user_cefr_level.level }}
                  </span>
                </div>

                <p class="text-sm italic text-text-muted mb-3">
                  {{ review.user_cefr_level.reasons }}
                </p>

                <div class="flex flex-wrap gap-4 text-xs text-gray-500">
                  <p><i class="fas fa-calendar-alt mr-1"></i> {{ formatDate(review.created_at) }}</p>
                  <p><i class="fas fa-clock mr-1"></i> {{ formatDuration(review.history.duration_seconds) }}</p>
                  <p><i class="fas fa-comments mr-1"></i> Messages: {{ review.history.messages.length - 2 }}</p>
                </div>
              </div>

              <div class="flex flex-col gap-2 items-center justify-start">
                <button @click.prevent.stop="openDetails(review)" title="View" class="text-gray-600 hover:text-primary transition-colors">
                  <i class="fas fa-eye text-lg"></i>
                </button>
                <button @click.prevent.stop="deleteReview(review._id)" title="Delete" class="text-gray-600 hover:text-red-600 transition-colors">
                  <i class="fas fa-trash-alt text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <p v-else class="text-center text-text-muted text-sm italic">You don't have any conversation reviews yet.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, computed, ref, onBeforeUnmount, nextTick } from "vue"
import { useRoute, useRouter } from "vue-router"
import { commonStore, communicationReviewStore, promptStore, taskGeneratorStore } from "@/app"
import { formatDuration } from "@/shared/lib"
import { IConversationHistory, ICommunicationReview, IWord, TaskModeEnum, TaskTypeEnum } from "@/shared/types"
import { TheLoader, TheTask } from "@/shared/components"

export default defineComponent({
  components: {
    TheLoader,
    TheTask,
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const controller = new AbortController()
    const isReady = ref<boolean>(false)
    const isLoading = ref<boolean>(false)
    const activeTab = ref<"ERRORS" | "VOCAB" | "DIALOGUE" | "TASKS">("ERRORS")
    const selectedTopic = ref<string>("")

    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)
    const isSingle = computed(() => !!route.params.id)
    const getReviewsList = computed(() => communicationReviewStore.getReviewsList)
    const getCurrentReview = computed(() => communicationReviewStore.getCurrentReview)
    const getSelectedPrompt = computed(() => promptStore.getSelectedPrompt)
    const issueTopics = computed(() => {
      if (!getCurrentReview.value) return []

      const topics = getCurrentReview.value.error_analysis
        .flatMap((item) => item.issues?.map((issue) => issue?.topic_titles) || [])
        .filter(Boolean)
        .flat()

      return [...new Set(topics)]
    })

    onBeforeMount(() => {
      if (!getCurrentReview.value) {
        router.push({
          name: "platform.conversation-history",
        })
      }

      isReady.value = true
    })

    const formatDate = (date: Date | string) => {
      return new Date(date).toLocaleString()
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
        const cls = type === "error" ? "text-red-600 font-semibold" : "text-green-700 font-semibold"
        return `<span class="${cls}">${match}</span>`
      })
    }

    const openDetails = async (review: ICommunicationReview) => {
      communicationReviewStore.setCurrentReview(review)

      await taskGeneratorStore.fetchTasksByReviewId(review._id).catch((error: unknown) => console.log(error))

      selectedTopic.value = issueTopics.value?.[0] ?? ""
      activeTab.value = "ERRORS"

      router.push({
        name: "platform.conversation-history",
        params: { id: review._id },
      })
    }

    const generateTask = async () => {
      if (!getCurrentReview.value || isLoading.value || !selectedTopic.value) return

      try {
        isLoading.value = true

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
            explanation_language: getSelectedPrompt.value?.meta?.explanation_language || "",
            task_sentences_count: 10,
          },
          controller.signal
        )
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
      isReady,
      isSingle,
      activeTab,
      isLoading,
      selectedTopic,
      getReviewsList,
      getCurrentReview,
      issueTopics,
      getIsPageLoading,
      formatDate,
      formatDuration,
      openDetails,
      deleteReview,
      highlightWords,
      generateTask,
      handleAudioError,
      TaskTypeEnum,
    }
  },
})
</script>
