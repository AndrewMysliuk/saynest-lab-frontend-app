<template>
  <div class="task-practice">
    <div class="task-practice__loader" v-if="isLoading || !getCurrentTask">
      <TheLoader />
    </div>

    <div class="task-practice__content" v-else>
      <FillBlank v-if="getCurrentTask.type === TaskTypeEnum.FILL_BLANK" />

      <CorrectSentence v-if="getCurrentTask.type === TaskTypeEnum.CORRECT_SENTENCE" />

      <ListenAndType v-if="getCurrentTask.type === TaskTypeEnum.LISTEN_AND_TYPE" />

      <MatchTranslation v-if="getCurrentTask.type === TaskTypeEnum.MATCH_TRANSLATION" />

      <MultipleChoice v-if="getCurrentTask.type === TaskTypeEnum.MULTIPLE_CHOICE" />

      <ReorderWords v-if="getCurrentTask.type === TaskTypeEnum.REORDER_WORDS" />

      <div class="task-practice__content-header">
        <v-button label="Regenerate Task" buttonStyle="info" @click="regenerateTask" />
        <v-button label="Create Task" buttonStyle="action" @click="isTaskModalOpen = true" />
      </div>
    </div>

    <v-modal v-model="isTaskModalOpen">
      <TaskSelect :topic-title="getCurrentTask?.topic_titles?.[0] ?? ''" @close="isTaskModalOpen = false" />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from "vue"
import { taskGeneratorStore } from "@/app"
import { TheLoader, TaskSelect } from "@/shared/components"
import { TaskTypeEnum } from "@/shared/types"
import { FillBlank, CorrectSentence, ListenAndType, MatchTranslation, MultipleChoice, ReorderWords } from "./ui"

export default defineComponent({
  components: {
    TheLoader,
    TaskSelect,
    FillBlank,
    CorrectSentence,
    ListenAndType,
    MatchTranslation,
    MultipleChoice,
    ReorderWords,
  },

  setup() {
    const isTaskModalOpen = ref<boolean>(false)
    const isLoading = ref<boolean>(false)

    const getCurrentTask = computed(() => taskGeneratorStore.getCurrentTask)

    onBeforeMount(() => {
      taskGeneratorStore.parseCurrentTask()
    })

    const regenerateTask = async () => {
      if (getCurrentTask.value) {
        try {
          isLoading.value = true

          await taskGeneratorStore.generateTask({
            // user_id: "01fbe55b-9784-4fc9-90ff-3695d836cc2e",
            // organization_id: "01fbe55b-9784-4fc9-90ff-3695d836cc2e",
            gpt_payload: {
              model: "gpt-4o-mini",
            },
            type: getCurrentTask.value.type,
            mode: getCurrentTask.value.mode,
            sentence_count: 10,
            topic_titles: getCurrentTask.value.topic_titles,
            language: "Bulgarian",
            native_language: "Ukrainian",
          })
        } catch (error: unknown) {
          console.log(error)
        } finally {
          isLoading.value = false
        }
      }
    }

    return {
      isLoading,
      isTaskModalOpen,
      getCurrentTask,
      regenerateTask,
      TaskTypeEnum,
    }
  },
})
</script>
