<template>
  <div
    :class="[
      'fixed top-0 left-0 w-full text-center py-4 px-6 font-semibold text-lg transition-all duration-300 z-50 border-b border-gray-200',
      type === 'trial' ? 'bg-blue-50 text-blue-800' : 'bg-yellow-100 text-yellow-800',
    ]"
  >
    <span>{{ message }}</span>

    <template v-if="isLinkEnabled">
      <button @click="$emit('link-click')" class="ml-2 underline hover:text-current transition">
        {{ linkTitle }}
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    message: {
      type: String,
      required: true,
    },

    type: {
      type: String as () => "trial" | "expired",
      default: "trial",
    },

    isLinkEnabled: {
      type: Boolean,
      default: false,
    },

    linkTitle: {
      type: String,
      default: "",
    },
  },
})
</script>
