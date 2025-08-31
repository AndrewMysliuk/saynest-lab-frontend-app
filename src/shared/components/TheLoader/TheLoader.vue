<template>
  <div :class="[isAbsolute ? 'absolute' : 'fixed', 'inset-0 z-50 bg-white/80 flex items-center justify-center']">
    <div class="flex flex-col items-center space-y-4">
      <span class="h-4 w-4 rounded-full bg-primary animate-ping" />
      <p class="text-text-muted text-base text-center">
        {{ message || t("loader.default") }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useI18n } from "vue-i18n"

export default defineComponent({
  props: {
    message: {
      type: String,
      default: "",
    },

    isAbsolute: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { t } = useI18n()

    return { t }
  },
})
</script>
