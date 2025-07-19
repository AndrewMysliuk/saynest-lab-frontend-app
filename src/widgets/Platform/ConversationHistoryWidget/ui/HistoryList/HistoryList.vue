<template>
  <div class="py-10 px-6">
    <h1 class="text-3xl font-bold text-text-base mb-6">Conversation History</h1>

    <div v-if="getReviewsList.length" class="space-y-6">
      <div
        v-for="review in getReviewsList"
        :key="review._id"
        @click="openDetails(review)"
        class="p-4 relative flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm transition hover:bg-gray-50 cursor-pointer"
      >
        <div class="grid lg:grid-cols-12 gap-y-2 lg:gap-y-0 gap-x-4">
          <div class="lg:col-span-10">
            <h2 class="text-lg font-semibold text-gray-800 mb-2">
              {{ review.topic_title }}
            </h2>

            <div class="flex flex-wrap items-center gap-2 mb-4">
              <span class="px-2 py-0.5 bg-purple-100 text-purple-800 text-sm font-medium rounded-md">
                {{ review.target_language }}
              </span>
              <span v-if="review.user_ielts_mark" class="px-2 py-0.5 bg-blue-100 text-blue-800 text-sm font-semibold rounded-md">
                IELTS: {{ review.user_ielts_mark.toFixed(1).replace(".", ",") }}
              </span>
              <span v-else class="px-2 py-0.5 bg-green-100 text-green-800 text-sm font-medium rounded-md">
                {{ review.user_cefr_level?.level }}
              </span>
            </div>

            <p v-if="review.user_cefr_level" class="text-sm italic text-gray-500 mb-4">
              {{ review.user_cefr_level.reasons }}
            </p>
            <p v-if="review?.conclusion && review.user_ielts_mark" class="text-sm italic text-gray-500 mb-4">
              {{ review.conclusion }}
            </p>

            <div class="flex flex-wrap gap-4 text-xs text-gray-500">
              <p><i class="fas fa-calendar-alt mr-1"></i> {{ formatDate(review.created_at) }}</p>
              <p><i class="fas fa-clock mr-1"></i> {{ formatDuration(review.history.duration_seconds) }}</p>
              <p><i class="fas fa-comments mr-1"></i> Messages: {{ review.history.messages.length - 2 }}</p>
            </div>
          </div>

          <div class="lg:col-span-2 hidden lg:flex items-start gap-2 flex-col ml-auto">
            <button @click.prevent.stop="openDetails(review)" title="View" class="size-8 inline-flex justify-center items-center text-gray-600 hover:text-blue-600 rounded-lg transition">
              <i class="fas fa-eye text-base"></i>
            </button>
            <button @click.prevent.stop="deleteReview(review._id)" title="Delete" class="size-8 inline-flex justify-center items-center text-gray-600 hover:text-red-600 rounded-lg transition">
              <i class="fas fa-trash-alt text-base"></i>
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6 lg:hidden">
          <button @click.prevent.stop="openDetails(review)" title="View" class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition">
            View
          </button>
          <button
            @click.prevent.stop="deleteReview(review._id)"
            title="Delete"
            class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div ref="loadMoreTrigger" class="h-1" />

      <div v-if="isListLoading" class="text-center text-text-muted text-sm italic py-4">Loading more...</div>
    </div>

    <p v-else class="text-center text-text-muted text-sm italic">You don't have any conversation reviews yet.</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted, onBeforeUnmount } from "vue"
import { communicationReviewStore } from "@/app"
import { formatDuration, formatDate } from "@/shared/lib"
import { ICommunicationReview } from "@/shared/types"

export default defineComponent({
  setup(_, { emit }) {
    const isListLoading = ref<boolean>(false)
    const loadMoreTrigger = ref<HTMLElement | null>(null)
    const observer = ref<IntersectionObserver | null>(null)

    const getReviewsList = computed(() => communicationReviewStore.getReviewsList)
    const getReviewsParams = computed(() => communicationReviewStore.getReviewsParams)

    onMounted(() => {
      observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && getReviewsParams.value.hasMore) {
          isListLoading.value = true

          communicationReviewStore.fetchReviewsList(true).finally(() => {
            isListLoading.value = false
          })
        }
      })

      if (loadMoreTrigger.value) {
        observer.value.observe(loadMoreTrigger.value)
      }
    })

    const openDetails = async (review: ICommunicationReview) => {
      emit("openDetails", review)
    }

    const deleteReview = (id: string) => {
      emit("deleteReview", id)
    }

    onBeforeUnmount(() => {
      observer.value?.disconnect()
    })

    return {
      isListLoading,
      loadMoreTrigger,
      observer,
      getReviewsList,
      openDetails,
      deleteReview,
      formatDuration,
      formatDate,
    }
  },
})
</script>
