<template>
  <TheHeader />

  <UserProgressWidgetPlatform />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { TheHeader } from "@/shared/components"
import { UserProgressWidgetPlatform } from "@/widgets"

export default defineComponent({
  components: {
    TheHeader,
    UserProgressWidgetPlatform,
  },
})
</script>
