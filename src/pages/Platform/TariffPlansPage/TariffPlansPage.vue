<template>
  <TheHeader />

  <TariffPlansWidgetPlatform />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { TariffPlansWidgetPlatform } from "@/widgets"
import { TheHeader } from "@/shared/components"

export default defineComponent({
  components: {
    TheHeader,
    TariffPlansWidgetPlatform,
  },
})
</script>
