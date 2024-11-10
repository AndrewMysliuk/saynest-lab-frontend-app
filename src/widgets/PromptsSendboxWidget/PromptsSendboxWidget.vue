<template>
  <div class="prompt">
    <h1>Prompts</h1>

    <div class="prompt__wrapper">
      <div class="prompt__card" v-for="prompt in getPromptList" :key="prompt.id" @click="selectPrompt(prompt)">
        <h3 class="prompt__card-title">{{ prompt?.title }}</h3>
      </div>
    </div>

    <v-modal v-model="isPromptModalOpen">
      <PromptDetails />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue"
import { promptStore } from "@/app"
import { IPrompt } from "@/shared/types"
import { PromptDetails } from "./ui"

export default defineComponent({
  components: {
    PromptDetails,
  },

  setup() {
    const isPromptModalOpen = ref<boolean>(false)

    const getPromptList = computed(() => promptStore.getPromptList)

    const selectPrompt = (prompt: IPrompt) => {
      promptStore.setPrompt(prompt)
      isPromptModalOpen.value = true
    }

    return {
      isPromptModalOpen,
      getPromptList,
      selectPrompt,
    }
  },
})
</script>
