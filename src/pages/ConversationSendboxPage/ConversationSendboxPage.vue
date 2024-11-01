<template>
  <ConversationSendboxWidget />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { ConversationSendboxWidget } from "@/widgets"

export default defineComponent({
  components: {
    ConversationSendboxWidget,
  },
})
</script>
