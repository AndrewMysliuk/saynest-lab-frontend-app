<template>
  <div class="multiple-choice-task">
    <div v-for="(question, qIndex) in taskData.sentences" :key="qIndex" class="multiple-choice-task__question-block">
      <div class="multiple-choice-task__question">{{ question.question }}</div>
      <div v-for="(option, optIndex) in question.options" :key="optIndex" class="multiple-choice-task__option">
        <label>
          <input type="checkbox" :value="optIndex" v-model="userAnswers[qIndex]" />
          {{ option }}
        </label>
      </div>
    </div>

    <button @click="checkAnswers" class="multiple-choice-task__button">Check Answers</button>

    <div v-if="resultsShown" class="multiple-choice-task__results">
      <div v-for="(question, qIndex) in taskData.sentences" :key="`result-${qIndex}`" class="multiple-choice-task__result-item">
        <span>{{ question.question }}</span>
        <span v-if="isCorrect(qIndex)" class="multiple-choice-task__correct">✔️ Correct</span>
        <span v-else class="multiple-choice-task__incorrect">❌ Incorrect</span>
        <div v-if="question.explanation" class="multiple-choice-task__explanation">Explanation: {{ question.explanation }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue"
import { taskGeneratorStore } from "@/app"
import { IMultipleChoiceTask } from "@/shared/types"

export default defineComponent({
  setup() {
    const currentTask = computed(() => taskGeneratorStore.getCurrentTask)

    const taskData = currentTask.value?.data as IMultipleChoiceTask

    const userAnswers = ref<number[][]>(taskData.sentences.map(() => []))

    const resultsShown = ref(false)

    const checkAnswers = () => {
      resultsShown.value = true
    }

    const isCorrect = (qIndex: number) => {
      const userSelection = userAnswers.value[qIndex].sort().join(",")
      const correctSelection = taskData.sentences[qIndex].correct_option_indexes.sort().join(",")
      return userSelection === correctSelection
    }

    return {
      taskData,
      userAnswers,
      checkAnswers,
      isCorrect,
      resultsShown,
    }
  },
})
</script>
