<template>
  <div class="sendbox">
    <h1>Prompts</h1>

    <div class="sendbox__wrapper">
      <div class="sendbox__prompt" @click="isPromptModalOpen = true">
        <h3 class="sendbox__prompt-title">Mock Prompt</h3>
      </div>
    </div>

    <v-modal v-model="isPromptModalOpen">
      <PromptDetails />
    </v-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { PromptDetails } from "./ui"

export default defineComponent({
  components: {
    PromptDetails,
  },

  setup() {
    const isPromptModalOpen = ref<boolean>(false)

    return {
      isPromptModalOpen,
    }
  },
})
</script>
