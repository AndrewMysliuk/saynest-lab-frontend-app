<template>
  <div class="dashboard">
    <h1>Prompts</h1>

    <div class="dashboard__wrapper">
      <div class="dashboard__card" v-for="prompt in getPromptList" :key="prompt.id" @click="selectPrompt(prompt)">
        <h3 class="dashboard__card-title">{{ prompt?.title }}</h3>

        <br />

        <p class="dashboard__card-description">{{ prompt.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick } from "vue"
import { useRouter } from "vue-router"
import { promptStore } from "@/app"
import { IPrompt } from "@/shared/types"

export default defineComponent({
  setup() {
    const router = useRouter()

    const getPromptList = computed(() => promptStore.getPromptList)

    const selectPrompt = (prompt: IPrompt) => {
      promptStore.setPrompt(prompt)

      nextTick(() => {
        router.push({ name: "sendbox.conversation" })
      })
    }

    return {
      getPromptList,
      selectPrompt,
    }
  },
})
</script>
