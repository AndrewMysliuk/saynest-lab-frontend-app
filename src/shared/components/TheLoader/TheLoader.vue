<template>
  <div class="fixed inset-0 z-50 bg-white/80 flex items-center justify-center">
    <div class="flex flex-col items-center space-y-4">
      <span class="h-4 w-4 rounded-full bg-primary animate-ping"></span>
      <p class="text-text-muted text-base text-center">{{ message }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    message: {
      type: String,
      default: "Please Stand By...",
    },
  },
})
</script>
