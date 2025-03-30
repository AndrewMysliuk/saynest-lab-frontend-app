<template>
  <TheHeader />

  <ConversationDashboardWidgetSendbox />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { ConversationDashboardWidgetSendbox } from "@/widgets"
import { TheHeader } from "@/shared/components"

export default defineComponent({
  components: {
    TheHeader,
    ConversationDashboardWidgetSendbox,
  },
})
</script>
