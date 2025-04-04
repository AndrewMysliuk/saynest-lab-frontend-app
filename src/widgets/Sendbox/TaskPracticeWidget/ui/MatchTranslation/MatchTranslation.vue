<template>
  <div class="match-translation-task">
    <div v-for="(sentence, index) in taskData.sentences" :key="index" class="match-translation-task__sentence-pair">
      <div class="match-translation-task__source-sentence">{{ sentence.source }}</div>
      <select v-model="userAnswers[index]" class="match-translation-task__select">
        <option disabled value="">Select translation</option>
        <option v-for="(option, idx) in shuffledOptions[index]" :key="idx" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <button @click="checkAnswers" class="match-translation-task__button">Check answers</button>

    <div v-if="resultsShown" class="match-translation-task__results">
      <div v-for="(sentence, index) in taskData.sentences" :key="`result-${index}`" class="match-translation-task__result-item">
        <span>{{ sentence.source }} — {{ userAnswers[index] }}</span>
        <span v-if="isCorrect(index)" class="match-translation-task__correct">✔️</span>
        <span v-else class="match-translation-task__incorrect">❌ ({{ sentence.correct_target }})</span>
        <div v-if="sentence.explanation" class="match-translation-task__explanation">Explanation: {{ sentence.explanation }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue"
import { taskGeneratorStore } from "@/app"
import { IMatchTranslationTask } from "@/shared/types"

export default defineComponent({
  setup() {
    const currentTask = computed(() => taskGeneratorStore.getCurrentTask)

    const taskData = currentTask.value?.data as IMatchTranslationTask

    const userAnswers = ref<string[]>(taskData.sentences.map(() => ""))

    const shuffledOptions = computed(() =>
      taskData.sentences.map(({ correct_target, distractors }) => {
        const allOptions = [correct_target, ...(distractors || [])]
        return allOptions.sort(() => Math.random() - 0.5)
      })
    )

    const resultsShown = ref(false)

    const checkAnswers = () => {
      resultsShown.value = true
    }

    const isCorrect = (index: number) => {
      return userAnswers.value[index] === taskData.sentences[index].correct_target
    }

    return {
      taskData,
      userAnswers,
      shuffledOptions,
      checkAnswers,
      isCorrect,
      resultsShown,
    }
  },
})
</script>
