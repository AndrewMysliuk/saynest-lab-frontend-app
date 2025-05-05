<template>
  <TheHeader />

  <ConversationDashboardWidgetPlatform />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { ConversationDashboardWidgetPlatform } from "@/widgets"
import { TheHeader } from "@/shared/components"

export default defineComponent({
  components: {
    TheHeader,
    ConversationDashboardWidgetPlatform,
  },
})
</script>
