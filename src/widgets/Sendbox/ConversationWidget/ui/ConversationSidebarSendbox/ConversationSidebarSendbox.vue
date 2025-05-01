<template>
  <div class="room__sidebar">
    <h3 class="room__sidebar-title">Conversation History</h3>

    <div class="room__sidebar-navbar">
      <v-button label="History" buttonStyle="regular" @click="currenSection = 'history'" />
    </div>

    <div class="room__history" v-if="currenSection === 'history'">
      <div v-for="(conversationItem, index) in getConversationHistory" :key="index" class="conversation-item">
        <div :class="['speaker', conversationItem.role || '']">
          <div>{{ conversationItem.role.replace("_", " ") }}</div>
          <!-- <div class="close" @click="deleteConversationItem(conversationItem.id)">Remove</div> -->
        </div>
        <div class="speaker-content">
          <div v-if="conversationItem.content">
            {{ conversationItem.content }}
          </div>

          <audio v-if="conversationItem.audio_url" :src="conversationItem.audio_url" controls />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue"
import { conversationStore } from "@/app"

export default defineComponent({
  setup() {
    const currenSection = ref<"history">("history")

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
      currenSection,
      getConversationHistory,
    }
  },
})
</script>
