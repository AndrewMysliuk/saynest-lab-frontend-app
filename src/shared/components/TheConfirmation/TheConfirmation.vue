<template>
  <div class="flex items-center justify-center bg-opacity-50">
    <div class="bg-white rounded-xl shadow-lg w-[400px] max-w-full p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ title }}</h3>
      <p class="text-gray-600 mb-6">{{ description }}</p>

      <div class="flex justify-end gap-2">
        <button @click="$emit('cancel')" class="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Cancel</button>
        <button @click="$emit('accept')" class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition">I'm Sure</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
})
</script>
