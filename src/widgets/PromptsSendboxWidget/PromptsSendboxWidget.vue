<template>
  <div class="prompt">
    <h1>Prompts</h1>

    <div class="prompt__wrapper">
      <div class="prompt__card" v-for="prompt in getPromptList" :key="prompt.id" @click="selectPrompt(prompt)">
        <h3 class="prompt__card-title">{{ prompt?.title }}</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick } from "vue"
import { promptStore } from "@/app"
import { useRouter } from "vue-router"
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
