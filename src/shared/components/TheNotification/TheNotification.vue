<template>
  <div
    :class="[
      'fixed top-0 left-0 w-full py-4 px-6 font-semibold text-lg transition-all duration-300 z-50 border-b border-gray-200 overflow-hidden',
      type === 'trial' ? 'bg-gray-100 text-gray-800' : 'bg-amber-300 text-[#1A1200]',
    ]"
  >
    <div class="inline-block whitespace-nowrap animate-marquee" ref="content">
      <span>{{ message }}</span>
      <template v-if="isLinkEnabled">
        <button @click="$emit('link-click')" class="ml-2 underline hover:text-current transition">
          {{ linkTitle }}
        </button>
      </template>
    </div>
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
