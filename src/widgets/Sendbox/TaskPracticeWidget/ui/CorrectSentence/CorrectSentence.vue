<template>
  <div class="correct-sentence-task" v-if="correctSentenceTask">
    <div v-for="(item, index) in correctSentenceTask.sentences" :key="index" class="correct-sentence-task__item">
      <p class="correct-sentence-task__title">Find the error in the word:</p>
      <p class="correct-sentence-task__sentence">{{ item.sentence_with_error }}</p>

      <div class="correct-sentence-task__input-block">
        <label class="correct-sentence-task__label">
          Your correction:
          <input
            v-model="userAnswers[index]"
            type="text"
            class="correct-sentence-task__input"
            :class="{
              'correct-sentence-task__input--correct': checked[index] && isCorrect(index),
              'correct-sentence-task__input--incorrect': checked[index] && !isCorrect(index),
            }"
            placeholder="Enter the corrected word"
            @input="resetCheck(index)"
          />
        </label>
        <button class="correct-sentence-task__button" @click="checkAnswer(index)">Answer?</button>
      </div>

      <div v-if="checked[index]" class="correct-sentence-task__feedback">
        <p>
          ✅ <strong>Correct word:</strong>
          <code>{{ getCorrectedWord(item, index) }}</code>
        </p>
        <p v-if="item.explanation">💡 <em>Explanation:</em> {{ item.explanation }}</p>
      </div>
    </div>

    <button class="correct-sentence-task__check-all" @click="checkAll">Check All</button>
  </div>
</template>

<script lang="ts">
import { taskGeneratorStore } from "@/app"
import { ICorrectSentenceTask, TaskTypeEnum } from "@/shared/types"
import { defineComponent, computed, ref, watch } from "vue"

export default defineComponent({
  name: "CorrectSentenceTask",
  setup() {
    const currentTask = computed(() => taskGeneratorStore.getCurrentTask)
    const correctSentenceTask = computed(() => {
      if (currentTask.value?.type === TaskTypeEnum.CORRECT_SENTENCE) {
        return currentTask.value.data as ICorrectSentenceTask
      }
      return null
    })

    const userAnswers = ref<string[]>([])
    const checked = ref<boolean[]>([])

    const getCorrectedWord = (item: ICorrectSentenceTask["sentences"][0], _index: number) => {
      const wrongWords = item.sentence_with_error.split(" ")
      const correctWords = item.corrected_sentence.split(" ")
      for (let i = 0; i < Math.max(wrongWords.length, correctWords.length); i++) {
        if (wrongWords[i] !== correctWords[i]) {
          return correctWords[i] || ""
        }
      }
      return ""
    }

    const isCorrect = (index: number) => {
      return userAnswers.value[index].trim().toLowerCase() === getCorrectedWord(correctSentenceTask.value!.sentences[index], index).toLowerCase()
    }

    const checkAnswer = (index: number) => {
      checked.value[index] = true
    }

    const resetCheck = (index: number) => {
      checked.value[index] = false
    }

    const checkAll = () => {
      checked.value = userAnswers.value.map(() => true)
    }

    watch(
      correctSentenceTask,
      (newTask) => {
        if (newTask) {
          userAnswers.value = newTask.sentences.map(() => "")
          checked.value = newTask.sentences.map(() => false)
        }
      },
      { immediate: true }
    )

    return {
      correctSentenceTask,
      userAnswers,
      checked,
      checkAnswer,
      checkAll,
      resetCheck,
      getCorrectedWord,
      isCorrect,
    }
  },
})
</script>
