<template>
  <div class="room__sidebar">
    <h3 class="room__sidebar-title">Conversation History</h3>

    <div class="room__sidebar-navbar">
      <v-button label="History" buttonStyle="regular" @click="currenSection = 'history'" />
      <v-button label="Tools" buttonStyle="regular" @click="currenSection = 'tools'" />
      <v-button label="Events" buttonStyle="regular" @click="currenSection = 'events'" />
    </div>

    <div class="room__history" v-if="currenSection === 'history'">
      <div v-for="conversationItem in getItems" :key="conversationItem.id" class="conversation-item">
        <div :class="['speaker', conversationItem.role || '']">
          <div>{{ (conversationItem.role || conversationItem.type).replace("_", " ") }}</div>
          <div class="close" @click="deleteConversationItem(conversationItem.id)">Remove</div>
        </div>
        <div class="speaker-content">
          <div v-if="conversationItem.type === 'function_call_output'">
            {{ conversationItem.formatted.output }}
          </div>
          <div v-if="conversationItem.formatted.tool">{{ conversationItem.formatted.tool.name }}({{ conversationItem.formatted.tool.arguments }})</div>
          <div v-if="!conversationItem.formatted.tool && conversationItem.role === 'user'">
            {{ conversationItem.formatted.transcript || (conversationItem.formatted.audio?.length ? "(awaiting transcript)" : conversationItem.formatted.text || "(item sent)") }}
          </div>
          <div v-if="!conversationItem.formatted.tool && conversationItem.role === 'assistant'">
            {{ conversationItem.formatted.transcript || conversationItem.formatted.text || "(truncated)" }}
          </div>
          <audio v-if="conversationItem.formatted.file" :src="conversationItem.formatted.file.url" controls />
        </div>
      </div>
    </div>

    <div class="room__history" v-if="currenSection === 'tools'">
      <div class="content-block kv">
        <div class="content-block-title">Memory Store:</div>
        <div class="content-block-body content-kv">
          {{ JSON.stringify(getMemoryKeyValue, null, 2) }}
        </div>
      </div>
    </div>

    <div class="room__history" v-if="currenSection === 'events'">
      <div class="content-block-body">
        <div v-for="realtimeEvent in getRealtimeEvents" :key="realtimeEvent.event.event_id" class="event">
          <div class="event-timestamp">{{ formatTimeForLogs(startTimestamp, realtimeEvent.time) }}</div>
          <div class="event-details">
            <div class="event-summary" @click="setExpandedEvents(realtimeEvent.event.event_id)">
              <div :class="['event-source', realtimeEvent.event.type === 'error' ? 'error' : realtimeEvent.source]">
                <span>
                  {{ realtimeEvent.event.type === "error" ? "error!" : realtimeEvent.source }}
                </span>
              </div>
              <div class="event-type">
                {{ realtimeEvent.event.type }}<span v-if="realtimeEvent.count"> ({{ realtimeEvent.count }})</span>
              </div>
            </div>
            <div v-if="getExpandedEvents[realtimeEvent.event.event_id]" class="event-payload">
              {{ JSON.stringify(realtimeEvent.event, null, 2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { realtimeStore } from "@/app"
import { formatTimeForLogs } from "@/shared/lib"

export default defineComponent({
  props: {
    startTimestamp: {
      type: String,
      default: "",
    },
  },

  setup(_, { emit }) {
    const currenSection = ref<"history" | "tools" | "events">("history")

    const getItems = computed(() => realtimeStore.getItems)
    const getRealtimeEvents = computed(() => realtimeStore.getRealtimeEvents)

    const deleteConversationItem = (id: string) => {
      emit("delete-item", id)
    }

    const setExpandedEvents = (eventId: string) => {
      realtimeStore.setExpandedEvents(eventId)
    }

    return {
      currenSection,
      getItems,
      getRealtimeEvents,
      getExpandedEvents: realtimeStore.expandedEvents,
      getMemoryKeyValue: realtimeStore.memoryKeyValue,
      deleteConversationItem,
      setExpandedEvents,
      formatTimeForLogs,
    }
  },
})
</script>
