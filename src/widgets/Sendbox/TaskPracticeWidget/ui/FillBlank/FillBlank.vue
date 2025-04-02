<template>
  <div v-if="getCurrentTask">
    <div v-for="(sentence, index) in (getCurrentTask.data as IFillBlankTask).sentences" :key="index" class="fill-blank-task__sentence">
      <p class="fill-blank-task__text">
        <strong class="fill-blank-task__number">{{ index + 1 }}.</strong>
        <template v-for="(part, i) in splitSentence(sentence.sentence_with_blanks)" :key="`part-${index}-${i}`">
          <span>{{ part }}</span>

          <template v-if="i < sentence.correct_answers.length">
            <select
              v-if="getCurrentTask.mode === TaskModeEnum.SELECT"
              v-model="userAnswers[`blank-${index}-${i}`]"
              class="fill-blank-task__select"
              :class="{
                correct: showResult && isCorrect(index, i),
                incorrect: showResult && !isCorrect(index, i),
              }"
              @change="handleUserInput"
            >
              <option v-for="(option, optIndex) in getOptions(sentence, i)" :key="optIndex" :value="option">
                {{ option }}
              </option>
            </select>

            <input
              v-else
              type="text"
              v-model="userAnswers[`blank-${index}-${i}`]"
              class="fill-blank-task__input"
              :class="{
                correct: showResult && isCorrect(index, i),
                incorrect: showResult && !isCorrect(index, i),
              }"
              @input="handleUserInput"
            />
          </template>
        </template>
      </p>
    </div>

    <div class="fill-blank-task__footer">
      <v-button label="Check" buttonStyle="regular" @click="checkAnswers" />
      <span v-if="showResult" class="fill-blank-task__result"> Correct: {{ correctCount }} з {{ totalCount }} </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue"
import { TaskModeEnum, TaskTypeEnum, IFillBlankTask, ITaskSentence } from "@/shared/types"
import { taskGeneratorStore } from "@/app"

export default defineComponent({
  setup() {
    const userAnswers = ref<Record<string, string>>({})
    const showResult = ref(false)

    const getCurrentTask = computed(() => taskGeneratorStore.getCurrentTask)
    const correctCount = computed(() => {
      let count = 0
      const task = getCurrentTask.value?.data as IFillBlankTask
      task.sentences.forEach((sentence, sentenceIndex) => {
        sentence.correct_answers.forEach((_answer, blankIndex) => {
          if (isCorrect(sentenceIndex, blankIndex)) count++
        })
      })
      return count
    })

    const totalCount = computed(() => {
      const task = getCurrentTask.value?.data as IFillBlankTask
      return task.sentences.reduce((sum, s) => sum + s.correct_answers.length, 0)
    })

    const splitSentence = (sentence: string): string[] => {
      return sentence.split(/_{2,}/g)
    }

    const getOptions = (sentence: ITaskSentence, index: number) => {
      return sentence.options[index]
    }

    const isCorrect = (sentenceIndex: number, blankIndex: number): boolean => {
      const correct = (getCurrentTask.value?.data as IFillBlankTask).sentences[sentenceIndex].correct_answers[blankIndex]
      const userInput = userAnswers.value[`blank-${sentenceIndex}-${blankIndex}`]?.trim()
      return correct.trim().toLowerCase() === userInput?.toLowerCase()
    }

    const checkAnswers = () => {
      showResult.value = true
    }

    const handleUserInput = () => {
      showResult.value = false
    }

    return {
      userAnswers,
      getCurrentTask,
      correctCount,
      totalCount,
      splitSentence,
      getOptions,
      isCorrect,
      checkAnswers,
      handleUserInput,
      showResult,
      TaskModeEnum,
      TaskTypeEnum,
    }
  },
})
</script>
