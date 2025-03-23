<template>
  <div class="prompt__modal">
    <div class="prompt__modal-scroll">
      <h3 class="prompt__modal-title">{{ getSelectedPrompt?.title }}</h3>

      <br /><br />

      <p class="prompt__modal-desc" v-if="getSelectedPrompt?.description">
        {{ getSelectedPrompt?.description }}
      </p>

      <br /><br />

      <!-- <div v-if="getCorrectionsFromHistory.length">
        <h4>Helpful Tips</h4>

        <div class="prompt__modal-separator" v-for="(item, index) in getCorrectionsFromHistory" :key="index">
          <div class="conversation__warning --flexible" v-html="item" />
        </div>
      </div> -->
    </div>
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
