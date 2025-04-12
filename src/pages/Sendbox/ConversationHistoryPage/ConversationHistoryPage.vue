<template>
  <TheHeader />

  <ConversationHistoryWidgetSendbox />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { ConversationHistoryWidgetSendbox } from "@/widgets"
import { TheHeader } from "@/shared/components"

export default defineComponent({
  components: {
    TheHeader,
    ConversationHistoryWidgetSendbox,
  },
})
</script>
