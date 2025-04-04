<template>
  <div class="reorder-words-task">
    <div v-for="(sentence, index) in taskData.sentences" :key="index" class="reorder-words-task__sentence">
      <div class="reorder-words-task__instruction">Arrange the words in correct order:</div>

      <!-- DRAG_AND_DROP Mode -->
      <div v-if="taskMode === 'DRAG_AND_DROP'" class="reorder-words-task__drag-drop">
        <div class="reorder-words-task__available">
          <div v-for="(word, i) in availableWords[index]" :key="'available-' + i" class="reorder-words-task__word" @click="moveWordToAnswer(index, word)">
            {{ word }}
          </div>
        </div>

        <div class="reorder-words-task__answer">
          <div v-for="(word, i) in userAnswers[index]" :key="'answer-' + i" class="reorder-words-task__word reorder-words-task__word--filled" @click="removeWordFromAnswer(index, word)">
            {{ word }}
          </div>
        </div>
      </div>

      <!-- SELECT Mode -->
      <div v-if="taskMode === 'SELECT'" class="reorder-words-task__select-row">
        <div v-for="(_slot, slotIndex) in sentence.shuffled.length" :key="'select-' + slotIndex" class="reorder-words-task__select-item">
          <select v-model="userAnswers[index][slotIndex]">
            <option disabled value="">Select word</option>
            <option v-for="(word, wordIndex) in sentence.shuffled" :key="'option-' + wordIndex" :value="word" :disabled="userAnswers[index].includes(word)">
              {{ word }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <button @click="checkAnswers" class="reorder-words-task__button">Check Answers</button>

    <div v-if="resultsShown" class="reorder-words-task__results">
      <div v-for="(sentence, index) in taskData.sentences" :key="'result-' + index" class="reorder-words-task__result">
        <span>Your answer: {{ userAnswers[index].join(" ") }}</span>
        <span v-if="isCorrect(index)" class="reorder-words-task__correct">✔️ Correct</span>
        <span v-else class="reorder-words-task__incorrect">❌ Correct: {{ sentence.correct_order.join(" ") }}</span>
        <div v-if="sentence.explanation" class="reorder-words-task__explanation">Explanation: {{ sentence.explanation }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue"
import { taskGeneratorStore } from "@/app"
import { IReorderWordsTask, TaskModeEnum } from "@/shared/types"

export default defineComponent({
  setup() {
    const currentTask = computed(() => taskGeneratorStore.getCurrentTask)

    const taskData = currentTask.value?.data as IReorderWordsTask
    const taskMode = currentTask.value?.mode as TaskModeEnum

    const userAnswers = ref<string[][]>(taskMode === "DRAG_AND_DROP" ? taskData.sentences.map(() => []) : taskData.sentences.map(() => Array(taskData.sentences[0].shuffled.length).fill("")))

    const availableWords = ref<string[][]>(taskMode === "DRAG_AND_DROP" ? taskData.sentences.map((sentence) => [...sentence.shuffled]) : [])

    const moveWordToAnswer = (sentenceIndex: number, word: string) => {
      const from = availableWords.value[sentenceIndex]
      const to = userAnswers.value[sentenceIndex]
      const wordIndex = from.indexOf(word)
      if (wordIndex !== -1) {
        from.splice(wordIndex, 1)
        to.push(word)
      }
    }

    const removeWordFromAnswer = (sentenceIndex: number, word: string) => {
      const from = userAnswers.value[sentenceIndex]
      const to = availableWords.value[sentenceIndex]
      const wordIndex = from.indexOf(word)
      if (wordIndex !== -1) {
        from.splice(wordIndex, 1)
        to.push(word)
      }
    }

    const resultsShown = ref(false)

    const checkAnswers = () => {
      resultsShown.value = true
    }

    const isCorrect = (index: number) => {
      return userAnswers.value[index].join(" ") === taskData.sentences[index].correct_order.join(" ")
    }

    return {
      taskData,
      taskMode,
      userAnswers,
      availableWords,
      moveWordToAnswer,
      removeWordFromAnswer,
      checkAnswers,
      isCorrect,
      resultsShown,
    }
  },
})
</script>

