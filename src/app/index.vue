<template>
  <div id="app-wrapper">
    <TheLoader v-if="getIsPageLoading" />

    <router-view v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { commonStore } from "."
import { TheLoader } from "@/shared/components"

export default defineComponent({
  components: {
    TheLoader,
  },

  setup() {
    const getIsPageLoading = computed(() => commonStore.getIsPageLoading)

    return {
      getIsPageLoading,
    }
  },
})
</script>
