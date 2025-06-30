<template>
  <TheHeader />

  <VocabularyWidgetPlatform />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { VocabularyWidgetPlatform } from "@/widgets"
import { TheHeader } from "@/shared/components"

export default defineComponent({
  components: {
    TheHeader,
    VocabularyWidgetPlatform,
  },
})
</script>
