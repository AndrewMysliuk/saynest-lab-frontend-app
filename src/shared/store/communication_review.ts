import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { ICommunicationReview, ICommunicationReviewGenerateRequest, ICommunicationReviewUpdateAudioUrl } from "../types"
import { deleteReviewHandler, generateConversationReviewHandler, getReviewHandler, reviewsListHandler, updateAudioUrlHandler } from "../api"

export const useCommunicationReviewStore = defineStore("communicationReviewStore", () => {
  const reviewsList = ref<ICommunicationReview[]>([])
  const currentReview = ref<ICommunicationReview | null>(null)

  const getReviewsList = computed(() => reviewsList.value)
  const getCurrentReview = computed(() => currentReview.value)

  const setCurrentReview = (review: ICommunicationReview) => {
    currentReview.value = review
  }

  const generateConversationReview = async (payload: ICommunicationReviewGenerateRequest) => {
    await generateConversationReviewHandler(payload)
      .then((response: ICommunicationReview) => {
        currentReview.value = response

        const alreadyExists = reviewsList.value.some((r) => r._id === response._id)

        if (!alreadyExists) {
          reviewsList.value.push(response)
        }
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchReviewsList = async () => {
    await reviewsListHandler()
      .then((response: ICommunicationReview[]) => {
        reviewsList.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchReviewById = async (review_id: string) => {
    await getReviewHandler(review_id)
      .then((response: ICommunicationReview) => {
        currentReview.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchDeleteReviewById = async (review_id: string) => {
    return deleteReviewHandler(review_id)
      .then((response: boolean) => {
        reviewsList.value = reviewsList.value.filter((review) => review._id !== review_id)

        return response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchUpdateAudioUrl = async (dto: ICommunicationReviewUpdateAudioUrl) => {
    await updateAudioUrlHandler(dto)
      .then((response: string) => {
        if (currentReview.value && currentReview.value.history?.messages) {
          currentReview.value.history.messages = currentReview.value.history.messages.map((item) => (item.pair_id === dto.pair_id && item.role === dto.role ? { ...item, audio_url: response } : item))
        }
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  return {
    getReviewsList,
    getCurrentReview,
    setCurrentReview,
    generateConversationReview,
    fetchReviewsList,
    fetchReviewById,
    fetchDeleteReviewById,
    fetchUpdateAudioUrl,
  }
})
