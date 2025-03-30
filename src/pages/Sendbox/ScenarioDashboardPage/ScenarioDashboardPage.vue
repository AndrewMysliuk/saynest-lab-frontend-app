<template>
  <TheHeader />
  <ScenarioDashboardWidgetSendbox />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { ScenarioDashboardWidgetSendbox } from "@/widgets"
import { TheHeader } from "@/shared/components"

export default defineComponent({
  components: {
    TheHeader,
    ScenarioDashboardWidgetSendbox,
  },
})
</script>
