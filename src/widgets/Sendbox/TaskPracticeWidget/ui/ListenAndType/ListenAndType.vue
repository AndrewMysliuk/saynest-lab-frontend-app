<template>
  <div class="listen-and-type-task">
    <div v-for="(item, index) in taskData.sentences" :key="index" class="listen-and-type-task__item">
      <div class="listen-and-type-task__audio">
        <audio :src="`${VITE_API_CORE_URL}${item.audio_url}`" controls />
      </div>

      <input v-model="userAnswers[index]" type="text" class="listen-and-type-task__input" placeholder="Type what you hear..." :disabled="resultsShown" @input="onInputChange" />

      <div v-if="resultsShown" class="listen-and-type-task__result">
        <span>
          Your answer: <strong>{{ userAnswers[index] }}</strong>
        </span>
        <span v-if="isCorrect(index)" class="listen-and-type-task__correct">✔️ Correct</span>
        <span v-else class="listen-and-type-task__incorrect">
          ❌ Correct: <strong>{{ item.correct_transcript }}</strong>
        </span>
        <div v-if="item.explanation" class="listen-and-type-task__explanation">Explanation: {{ item.explanation }}</div>
      </div>
    </div>

    <button @click="checkAnswers" class="listen-and-type-task__button">Check Answers</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue"
import { taskGeneratorStore } from "@/app"
import { IListenAndTypeTask } from "@/shared/types"

const VITE_API_CORE_URL: string = import.meta.env.VITE_API_CORE_URL

export default defineComponent({
  setup() {
    const currentTask = computed(() => taskGeneratorStore.getCurrentTask)
    const taskData = currentTask.value?.data as IListenAndTypeTask

    const userAnswers = ref<string[]>(taskData.sentences.map(() => ""))
    const resultsShown = ref(false)

    const checkAnswers = () => {
      resultsShown.value = true
    }

    const isCorrect = (index: number) => {
      const user = userAnswers.value[index].trim().toLowerCase()
      const correct = taskData.sentences[index].correct_transcript.trim().toLowerCase()
      return user === correct
    }

    const onInputChange = () => {
      if (resultsShown.value) resultsShown.value = false
    }

    return {
      taskData,
      userAnswers,
      resultsShown,
      checkAnswers,
      isCorrect,
      onInputChange,
      VITE_API_CORE_URL,
    }
  },
})
</script>
