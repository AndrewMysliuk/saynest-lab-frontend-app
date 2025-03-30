<template>
  <TheHeader />

  <GrammarDashboardWidgetSendbox />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { GrammarDashboardWidgetSendbox } from "@/widgets"
import { TheHeader } from "@/shared/components"

export default defineComponent({
  components: {
    TheHeader,
    GrammarDashboardWidgetSendbox,
  },
})
</script>
