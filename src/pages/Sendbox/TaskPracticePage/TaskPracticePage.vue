<template>
  <TheHeader />

  <TaskPracticeWidgetSendbox />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { TaskPracticeWidgetSendbox } from "@/widgets"
import { TheHeader } from "@/shared/components"

export default defineComponent({
  components: {
    TaskPracticeWidgetSendbox,
    TheHeader,
  },
})
</script>
