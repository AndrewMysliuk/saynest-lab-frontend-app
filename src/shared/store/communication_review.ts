import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { IStatistics, IStatisticsGenerateRequest } from "../types"
import { deleteReviewHandler, generateConversationReviewHandler, getReviewHandler, reviewsListHandler } from "../api"

export const useCommunicationReviewStore = defineStore("communicationReviewStore", () => {
  const reviewsList = ref<IStatistics[]>([])
  const currentReview = ref<IStatistics | null>(null)

  const getReviewsList = computed(() => reviewsList.value)
  const getCurrentReview = computed(() => currentReview.value)

  const setCurrentReview = (review: IStatistics) => {
    currentReview.value = review
  }

  const generateConversationReview = async (payload: IStatisticsGenerateRequest) => {
    await generateConversationReviewHandler(payload)
      .then((response: IStatistics) => {
        currentReview.value = response

        reviewsList.value.push(response)
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchReviewsList = async () => {
    await reviewsListHandler()
      .then((response: IStatistics[]) => {
        reviewsList.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchReviewById = async (review_id: string) => {
    await getReviewHandler(review_id)
      .then((response: IStatistics) => {
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

  return {
    getReviewsList,
    getCurrentReview,
    setCurrentReview,
    generateConversationReview,
    fetchReviewsList,
    fetchReviewById,
    fetchDeleteReviewById,
  }
})
