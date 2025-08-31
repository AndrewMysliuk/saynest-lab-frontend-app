<template>
  <div class="flex-grow min-h-0 bg-gray-50">
    <TheLoader v-if="!isReady || getIsPageLoading" />

    <div class="pt-16 max-w-[1720px] w-full mx-auto" v-else>
      <SingleHistory v-if="isSingle && getCurrentReview" />
      <HistoryList v-else @openDetails="openDetails" @deleteReview="deleteReview" />
    </div>

    <v-modal v-model="isDeleteModalOpen">
      <TheConfirmation :title="t('history.delete.title')" :description="t('history.delete.desc')" @accept="confirmDeleteReview" @cancel="isDeleteModalOpen = false" />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, computed, ref, defineAsyncComponent } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { commonStore, communicationReviewStore, taskGeneratorStore } from "@/app"
import { ICommunicationReview, TaskTypeEnum } from "@/shared/types"
import { TheLoader, TheConfirmation } from "@/shared/components"

export default defineComponent({
  components: {
    TheLoader,
    TheConfirmation,
    PublicLink: defineAsyncComponent(() => import("./ui/PublicLink")),
    SingleHistory: defineAsyncComponent(() => import("./ui/SingleHistory")),
    HistoryList: defineAsyncComponent(() => import("./ui/HistoryList")),
  },

  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const isReady = ref<boolean>(false)
    const isDeleteModalOpen = ref<boolean>(false)
    const selectedReviewId = ref<string>("")

    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)
    const isSingle = computed(() => !!route.params.id)
    const getCurrentReview = computed(() => communicationReviewStore.getCurrentReview)

    onBeforeMount(() => {
      if (!getCurrentReview.value) {
        router.push({
          name: "platform.history",
        })
      }

      isReady.value = true
    })

    const deleteReview = (id: string) => {
      selectedReviewId.value = id
      isDeleteModalOpen.value = true
    }

    const confirmDeleteReview = async () => {
      try {
        await communicationReviewStore.fetchDeleteReviewById(selectedReviewId.value)
      } catch (error) {
        console.error("Error deleting review:", error)
      } finally {
        isDeleteModalOpen.value = false
      }
    }

    const openDetails = async (review: ICommunicationReview) => {
      communicationReviewStore.setCurrentReview(review)

      await taskGeneratorStore.fetchTasksByReviewId(review._id).catch((error: unknown) => console.log(error))

      router.push({
        name: "platform.history",
        params: { id: review._id },
      })
    }

    return {
      isReady,
      isSingle,
      isDeleteModalOpen,
      getCurrentReview,
      getIsPageLoading,
      openDetails,
      deleteReview,
      confirmDeleteReview,
      TaskTypeEnum,
      t,
    }
  },
})
</script>
