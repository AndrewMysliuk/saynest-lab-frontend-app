<template>
  <div class="history">
    <h1 class="history__title">Conversation History</h1>

    <div class="history__content" v-if="getReviewsList.length">
      <ul class="history__list">
        <li v-for="review in getReviewsList" :key="review._id" class="history__item">
          <div class="history__item-info">
            <h2 class="history__item-title">{{ review.topic_title }}</h2>

            <div class="history__item-meta">
              <span class="history__badge">{{ review.language }}</span>
              <span class="history__badge history__badge--level">{{ review.user_cefr_level }}</span>
            </div>

            <div class="history__item-details">
              <p><i class="fas fa-calendar-alt"></i> {{ formatDate(review.created_at) }}</p>
              <p><i class="fas fa-clock"></i> {{ formatDuration(review.history.duration_seconds) }}</p>
              <p><i class="fas fa-comments"></i> Messages: {{ review.history.messages.length }}</p>
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
</template>

<script lang="ts">
import { communicationReviewStore } from "@/app"
import { IStatistics } from "@/shared/types"
import { defineComponent, onBeforeMount, computed } from "vue"

export default defineComponent({
  setup() {
    const getReviewsList = computed(() => communicationReviewStore.getReviewsList)

    onBeforeMount(async () => {
      await setupOnloadMethods()
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
      // TODO: implement the logic to open review details
    }

    const deleteReview = (id: string) => {
      // TODO: implement the logic to delete review
    }

    return {
      getReviewsList,
      formatDate,
      formatDuration,
      openDetails,
      deleteReview,
    }
  },
})
</script>
