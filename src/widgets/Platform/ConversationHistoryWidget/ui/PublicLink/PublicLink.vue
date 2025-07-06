<template>
  <div class="flex items-center justify-center bg-opacity-50">
    <div class="bg-white rounded-xl shadow-lg w-[400px] max-w-full p-6 relative">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Public Link Generated</h3>
      <p class="text-gray-600 text-sm mb-4">You can share this link with others — they don’t need an account.</p>

      <div class="relative mb-6">
        <input :value="fullLink" readonly class="w-full bg-gray-100 text-sm text-gray-800 px-4 py-2 rounded-md pr-10" />
        <button @click="copyToClipboard" class="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
          <i class="fas fa-copy"></i>
        </button>
      </div>

      <div class="flex justify-end">
        <button @click="$emit('close')" class="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Close</button>
      </div>

      <transition name="fade">
        <div v-if="copied" class="absolute top-2 right-2 text-xs text-white bg-[#5B3DF5] px-3 py-1 rounded-full shadow">Copied!</div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue"

export default defineComponent({
  props: {
    publicId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const fullLink = computed(() => `${window.location.origin}/session-review/${props.publicId}`)
    const copied = ref(false)

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(fullLink.value)
        copied.value = true
        setTimeout(() => {
          copied.value = false
        }, 2000)
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }

    return {
      fullLink,
      copied,
      copyToClipboard,
    }
  },
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
