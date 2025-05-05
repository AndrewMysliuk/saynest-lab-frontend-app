<template>
  <TheHeader />

  <ConversationHistoryWidgetPlatform />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { ConversationHistoryWidgetPlatform } from "@/widgets"
import { TheHeader } from "@/shared/components"

export default defineComponent({
  components: {
    TheHeader,
    ConversationHistoryWidgetPlatform,
  },
})
</script>
