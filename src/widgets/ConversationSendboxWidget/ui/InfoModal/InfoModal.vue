<template>
  <div class="prompt__modal">
    <h3 class="prompt__modal-title">{{ getSelectedPrompt?.title }}</h3>
    <br /><br />
    <p class="prompt__modal-desc" v-if="getSelectedPrompt?.description">
      {{ getSelectedPrompt?.description }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { promptStore } from "@/app"

export default defineComponent({
  setup() {
    const getSelectedPrompt = computed(() => promptStore.getSelectedPrompt)

    return {
      getSelectedPrompt,
    }
  },
})
</script>
