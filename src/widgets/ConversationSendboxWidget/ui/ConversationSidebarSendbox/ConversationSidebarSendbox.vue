<template>
  <div class="room__sidebar">
    <h3 class="room__sidebar-title">Conversation History</h3>

    <div class="room__sidebar-navbar">
      <v-button label="History" buttonStyle="regular" @click="currenSection = 'history'" />
    </div>

    <div class="room__history" v-if="currenSection === 'history'">
      <div v-for="(conversationItem, index) in removeCorrectionsFromHistory" :key="index" class="conversation-item">
        <div :class="['speaker', conversationItem.role || '']">
          <div>{{ conversationItem.role.replace("_", " ") }}</div>
          <!-- <div class="close" @click="deleteConversationItem(conversationItem.id)">Remove</div> -->
        </div>
        <div class="speaker-content">
          <div v-if="conversationItem.content">
            {{ conversationItem.content }}
          </div>

          <audio v-if="conversationItem.audioUrl" :src="`${VITE_API_CORE_URL}${conversationItem.audioUrl}`" controls />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue"
import { sendboxStore } from "@/app"
import { removeCorrections } from "@/shared/lib"

const VITE_API_CORE_URL: string = import.meta.env.VITE_API_CORE_URL

export default defineComponent({
  setup() {
    const currenSection = ref<"history">("history")

    const getConversationHistory = computed(() => sendboxStore.getConversationResponse?.conversation_history?.filter((item) => item.role !== "system") ?? [])
    const removeCorrectionsFromHistory = computed(() => getConversationHistory.value.map((item) => (item.role === "assistant" ? { ...item, content: removeCorrections(item.content) } : item)))

    return {
      currenSection,
      removeCorrectionsFromHistory,
      VITE_API_CORE_URL,
    }
  },
})
</script>
