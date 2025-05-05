<template>
  <div class="absolute top-0 left-0 h-full w-[640px] bg-white border-r border-gray-200 p-6 shadow-xl overflow-y-auto z-20">
    <h3 class="text-xl font-bold text-gray-800 mb-6">Conversation History</h3>

    <div v-for="(conversationItem, index) in getConversationHistory" :key="index" class="mb-6">
      <div class="flex items-center justify-between text-sm font-semibold mb-2 capitalize">
        <span :class="conversationItem.role === 'assistant' ? 'text-green-600' : conversationItem.role === 'user' ? 'text-blue-600' : 'text-gray-600'">
          {{ conversationItem.role.replace("_", " ") }}
        </span>
      </div>

      <div
        :class="[
          'border rounded-md p-4 text-sm space-y-2',
          conversationItem.role === 'assistant'
            ? 'bg-green-50 border-green-200 text-gray-800'
            : conversationItem.role === 'user'
              ? 'bg-blue-50 border-blue-200 text-gray-800'
              : 'bg-gray-50 border-gray-200 text-gray-800',
        ]"
      >
        <div v-if="conversationItem.content">
          {{ conversationItem.content }}
        </div>

        <audio v-if="conversationItem.audio_url" :src="conversationItem.audio_url" controls class="w-full rounded-md mt-2" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { conversationStore } from "@/app"

export default defineComponent({
  setup() {
    const getConversationHistory = computed(() => {
      const history = conversationStore.getConversationResponse?.conversation_history ?? []
      const firstUserIndex = history.findIndex((item) => item.role === "user")

      return history.filter((item, index) => {
        const isSystem = item.role === "system"
        const isFirstUser = index === firstUserIndex && item.role === "user"
        return !isSystem && !isFirstUser
      })
    })

    return {
      getConversationHistory,
    }
  },
})
</script>
