<template>
  <div class="tasks">
    <div class="tasks__container" v-if="!hasResult">
      <div class="tasks__question">
        <p>Set topic for task</p>

        <input type="text" v-model="topic" class="tasks__question-input" />
      </div>

      <div class="tasks__question">
        <p>Set count of question</p>

        <input type="text" v-model="amount" class="tasks__question-input" />

        <button @click="createTaskHandler" class="tasks__question-btn">Generate</button>
      </div>
    </div>

    <div class="tasks__container" v-else>
      <div v-for="(pair, index) in getGptMessage" :key="index" class="tasks__question">
        <p>{{ pair.question }}</p>

        <input type="text" v-model="userAnswers[index]" placeholder="Your answer..." class="tasks__question-input" />

        <button @click="toggleAnswer(index)" class="tasks__question-btn">Show Answer</button>

        <p v-if="showAnswers[index]" class="tasks__question-tip">Correct answer: {{ pair.answer }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent } from "vue"
import { sendboxStore } from "@/app"
import { parseData } from "@/shared/lib"

export default defineComponent({
  setup() {
    const hasResult = ref<boolean>(false)
    const amount = ref<string>("")
    const topic = ref<string>("")
    const getGptMessage = computed(() => parseData(sendboxStore.getGptMessage.content))
    const userAnswers = ref<string[]>(Array(getGptMessage.value.length).fill(""))
    const showAnswers = ref<boolean[]>(Array(getGptMessage.value.length).fill(false))

    const createTaskHandler = async () => {
      try {
        await sendboxStore.fetchTasksByGptModel({
          model: "gpt-4o-mini",
          max_tokens: 500,
          messages: [
            {
              role: "system",
              content: `
                You are a model designed to generate English language exercises for students. Your primary task is to assist teachers in creating exercises on various grammar and vocabulary topics. You should generate questions, starting from simple to more complex ones. Your responses will be used for student practice and quick review by teachers.
                Requirements:

                1. The topic and number of questions will be specified separately.
                2. You should always format your answers as a string using delimiters for easy parsing.
                3. Follow this structure: each question and answer pair should be separated by the symbol |, and each pair should be separated by a double symbol ||.
              `,
            },
            {
              role: "user",
              content: `
                Generate ${amount.value} questions on the topic "${topic.value}". The student needs to rephrase the sentences using the structure "${topic.value}".

                Instructions:
                1. Arrange the questions from simple to more complex.
                2. After each question, provide the correct answer using the structure "${topic.value}".
                3. Format your output using delimiters for easy parsing:
                  - Each question and answer pair should be separated by the symbol |.
                  - Separate each pair of questions and answers with a double symbol ||.
              `,
            },
          ],
        })

        hasResult.value = true
      } catch (error: unknown) {
        console.log(error)
      }
    }

    const toggleAnswer = (index: number) => {
      showAnswers.value[index] = !showAnswers.value[index]
    }

    return {
      amount,
      topic,
      hasResult,
      userAnswers,
      showAnswers,
      getGptMessage,
      toggleAnswer,
      createTaskHandler,
    }
  },
})
</script>
