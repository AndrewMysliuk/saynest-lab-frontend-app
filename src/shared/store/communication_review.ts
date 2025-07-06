import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { ICommunicationReview, ICommunicationReviewFilters, ICommunicationReviewGenerateRequest, ICommunicationReviewParams, ICommunicationReviewUpdateAudioUrl } from "../types"
import { deleteReviewHandler, generateConversationReviewHandler, generateReviewPublicIdHandler, getReviewByPublicIdHandler, getReviewHandler, reviewsListHandler, updateAudioUrlHandler } from "../api"

export const useCommunicationReviewStore = defineStore("communicationReviewStore", () => {
  const reviewsList = ref<ICommunicationReview[]>([])
  const currentReview = ref<ICommunicationReview | null>(null)
  const publicReview = ref<ICommunicationReview | null>(null)
  const reviewsParams = ref<ICommunicationReviewParams>({
    offset: 0,
    limit: 20,
    hasMore: true,
    isLoading: false,
  })

  const getReviewsList = computed(() => reviewsList.value)
  const getCurrentReview = computed(() => currentReview.value)
  const getPublicReview = computed(() => publicReview.value)
  const getReviewsParams = computed(() => reviewsParams.value)

  const setReviewList = (review: ICommunicationReview[]) => {
    reviewsList.value = review
  }

  const setCurrentReview = (review: ICommunicationReview) => {
    currentReview.value = review
  }

  const resetReviewsParams = () => {
    reviewsParams.value = {
      offset: 0,
      limit: 20,
      hasMore: true,
      isLoading: false,
    }
  }

  const generateConversationReview = async (payload: ICommunicationReviewGenerateRequest) => {
    await generateConversationReviewHandler(payload)
      .then((response: ICommunicationReview) => {
        currentReview.value = response

        const alreadyExists = reviewsList.value.some((r) => r._id === response._id)

        if (!alreadyExists) {
          reviewsList.value.unshift(response)
        }
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const fetchReviewsList = async (isLoadMore = false, query?: ICommunicationReviewFilters) => {
    try {
      if (reviewsParams.value.isLoading) return

      reviewsParams.value.isLoading = true

      if (!isLoadMore) {
        reviewsList.value = []
        resetReviewsParams()
      }

      const limit = query?.limit ?? reviewsParams.value.limit
      const offset = query?.offset ?? reviewsParams.value.offset

      const response = await reviewsListHandler({
        ...query,
        limit,
        offset,
      })

      if (isLoadMore) {
        reviewsList.value = [...reviewsList.value, ...response]
      } else {
        reviewsList.value = response
      }

      reviewsParams.value.offset = offset + limit
      reviewsParams.value.hasMore = response.length === limit
    } catch (error) {
      console.error("fetchReviewsList error:", error)
    } finally {
      reviewsParams.value.isLoading = false
    }
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

  const fetchReviewByPublicId = async (public_id: string) => {
    await getReviewByPublicIdHandler(public_id)
      .then((response: ICommunicationReview) => {
        publicReview.value = response
      })
      .catch((error: unknown) => {
        throw error
      })
  }

  const generateReviewPublicId = async (review_id: string) => {
    await generateReviewPublicIdHandler(review_id)
      .then((response: string) => {
        if (currentReview.value) {
          currentReview.value.public_id = response
        }

        if (reviewsList.value?.length) {
          reviewsList.value = reviewsList.value.map((item) => (item._id === review_id ? { ...item, public_id: response } : item))
        }
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
    getPublicReview,
    getReviewsParams,
    setCurrentReview,
    setReviewList,
    resetReviewsParams,
    generateConversationReview,
    generateReviewPublicId,
    fetchReviewsList,
    fetchReviewById,
    fetchReviewByPublicId,
    fetchDeleteReviewById,
    fetchUpdateAudioUrl,
  }
})
