<template>
  <div class="room">
    <!-- :class="{ '--sidebar-opened': isSidebarOpen }" -->
    <!-- <transition name="slide-left">
      <RoomSidebar v-if="isSidebarOpen" />
    </transition> -->

    <div class="room__body">
      <div data-component="ConsolePage">
        <div class="content-top">
          <div class="content-title">
            <span>realtime console</span>
          </div>
        </div>
        <div class="content-main">
          <div class="content-logs">
            <div class="content-block events">
              <div class="visualization">
                <div class="visualization-entry client">
                  <canvas ref="clientCanvasRef" />
                </div>
                <div class="visualization-entry server">
                  <canvas ref="serverCanvasRef" />
                </div>
              </div>
              <div class="content-block-title">events</div>
              <div class="content-block-body">
                <span v-if="!getRealtimeEvents.length">awaiting connection...</span>
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

            <div class="content-block conversation">
              <div class="content-block-title">conversation</div>
              <div class="content-block-body" data-conversation-content>
                <span v-if="!getItems.length">awaiting connection...</span>
                <div v-for="conversationItem in getItems" :key="conversationItem.id" class="conversation-item">
                  <div :class="['speaker', conversationItem.role || '']">
                    <!-- <div>{{ (conversationItem.role || conversationItem.type).replaceAll("_", " ") }}</div> -->
                    <div class="close" @click="deleteConversationItem(conversationItem.id)">Close</div>
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
            </div>

            <div class="content-actions">
              <v-switch :defaultValue="false" :labels="['manual', 'vad']" :values="['none', 'server_vad']" @change="(_: boolean, value: string) => changeTurnEndType(value)" />
              <div class="spacer" />
              <v-button
                v-if="getIsConnected && getCanPushToTalk"
                :label="getIsRecording ? 'release to send' : 'push to talk'"
                :buttonStyle="getIsRecording ? 'alert' : 'regular'"
                :disabled="!getIsConnected || !getCanPushToTalk"
                @mousedown="startRecording"
                @mouseup="stopRecording"
              />
              <div class="spacer" />
              <v-button
                :label="getIsConnected ? 'disconnect' : 'connect'"
                :buttonStyle="getIsConnected ? 'regular' : 'action'"
                @click="getIsConnected ? disconnectConversation() : connectConversation()"
              />
            </div>
          </div>

          <div class="content-right">
            <div class="content-block kv">
              <div class="content-block-title">set_memory()</div>
              <div class="content-block-body content-kv">
                {{ JSON.stringify(getMemoryKeyValue, null, 2) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from "vue"
import { RealtimeClient } from "@openai/realtime-api-beta"
import { realtimeStore } from "@/app"
import { WavRecorder, WavStreamPlayer, formatTimeForLogs, initializeCanvas } from "@/shared/lib"
import { testPrompt as instructions } from "@/shared/utils"
import { IRealtimeEvent } from "@/shared/types"
import { RoomSidebar } from "./ui"

export default defineComponent({
  components: {
    RoomSidebar,
  },

  setup() {
    const clientCanvasRef = ref<HTMLCanvasElement | null>(null)
    const serverCanvasRef = ref<HTMLCanvasElement | null>(null)
    // const isSidebarOpen = ref<boolean>(false)
    const startTimestamp = ref<string>("")
    const wavRecorder = ref(new WavRecorder({ sampleRate: 24000 }))
    const wavStreamPlayer = ref(new WavStreamPlayer({ sampleRate: 24000 }))
    const realtimeClient = ref(new RealtimeClient({ url: "http://localhost:3001" }))

    const getItems = computed(() => realtimeStore.getItems)
    const getRealtimeEvents = computed(() => realtimeStore.getRealtimeEvents)
    const getIsConnected = computed(() => realtimeStore.getIsConnected)
    const getCanPushToTalk = computed(() => realtimeStore.getCanPushToTalk)
    const getIsRecording = computed(() => realtimeStore.getIsRecording)

    const setExpandedEvents = (eventId: string) => {
      realtimeStore.setExpandedEvents(eventId)
    }

    const connectConversation = async () => {
      if (!realtimeClient.value || !wavRecorder.value || !wavRecorder.value) return

      startTimestamp.value = new Date().toISOString()
      realtimeStore.setIsConnected(true)
      realtimeStore.setRealtimeEvents([])
      realtimeStore.setItems(realtimeClient.value.conversation.getItems())

      await wavRecorder.value.begin()
      await wavStreamPlayer.value.connect()
      await realtimeClient.value.connect()

      realtimeClient.value.sendUserMessageContent([
        {
          type: `input_text`,
          text: `Hello!`,
        },
      ])

      if (realtimeClient.value.getTurnDetectionType() === "server_vad") {
        await wavRecorder.value.record((data) => realtimeClient.value.appendInputAudio(data.mono))
      }
    }

    const disconnectConversation = async () => {
      realtimeStore.setIsConnected(false)
      realtimeStore.setRealtimeEvents([])
      realtimeStore.setItems([])
      realtimeStore.clearMemoryKeyValue()

      realtimeClient.value?.disconnect()
      await wavRecorder.value?.end()
      await wavStreamPlayer.value?.interrupt()
    }

    const deleteConversationItem = async (id: string) => {
      realtimeClient.value?.deleteItem(id)
    }

    const startRecording = async () => {
      realtimeStore.setIsRecording(true)

      if (!realtimeClient.value || !wavRecorder.value || !wavStreamPlayer.value) return

      // Interrupt the audio stream player and get the track sample offset
      const trackSampleOffset = await wavStreamPlayer.value.interrupt()

      // If there is an active track, cancel the response
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset
        await realtimeClient.value.cancelResponse(trackId, offset)
      }

      // Start recording and append the audio data to the client
      await wavRecorder.value.record((data) => realtimeClient.value.appendInputAudio(data.mono))
    }

    const stopRecording = async () => {
      realtimeStore.setIsRecording(false)

      if (!realtimeClient.value || !wavRecorder.value) return

      // Pause the wavRecorder and create a response from the client
      await wavRecorder.value.pause()
      realtimeClient.value.createResponse()
    }

    const changeTurnEndType = async (value: string) => {
      if (!realtimeClient.value || !wavRecorder.value) return

      // Pause recording if in 'none' mode and currently recording
      if (value === "none" && wavRecorder.value.getStatus() === "recording") {
        await wavRecorder.value.pause()
      }

      // Update client session with turn detection type
      realtimeClient.value.updateSession({
        turn_detection: value === "none" ? null : { type: "server_vad" },
      })

      // If VAD mode is enabled and client is connected, start recording audio input
      if (value === "server_vad" && realtimeClient.value.isConnected()) {
        await wavRecorder.value.record((data) => realtimeClient.value.appendInputAudio(data.mono))
      }

      // Update the state of push-to-talk based on mode
      realtimeStore.setCanPushToTalk(value === "none")
    }

    onMounted(() => {
      const cleanupCanvas = initializeCanvas(clientCanvasRef.value, serverCanvasRef.value, wavRecorder.value, wavStreamPlayer.value)

      onBeforeUnmount(() => {
        cleanupCanvas()
      })
    })

    // Core RealtimeClient and audio capture setup
    onMounted(() => {
      // Set instructions
      realtimeClient.value.updateSession({ instructions })
      realtimeClient.value.updateSession({ input_audio_transcription: { model: "whisper-1" } })

      // Add tools
      realtimeClient.value.addTool(
        {
          name: "set_memory",
          description: "Saves important data about the user into memory.",
          parameters: {
            type: "object",
            properties: {
              key: { type: "string", description: "Key as lowercase and underscores" },
              value: { type: "string", description: "Value as a string" },
            },
            required: ["key", "value"],
          },
        },
        async ({ key, value }: Record<string, any>) => {
          realtimeStore.setMemoryKeyValue(key, value)
          return { ok: true }
        }
      )

      // Handle realtime events for logging and client-server communication
      realtimeClient.value.on("realtime.event", (realtimeEvent: IRealtimeEvent) => {
        const lastEvent = getRealtimeEvents.value[getRealtimeEvents.value.length - 1]
        if (lastEvent?.event.type === realtimeEvent.event.type) {
          lastEvent.count = (lastEvent.count || 0) + 1
        } else {
          realtimeStore.setRealtimeEvents([...getRealtimeEvents.value, realtimeEvent])
        }
      })

      realtimeClient.value.on("error", console.error)

      realtimeClient.value.on("conversation.interrupted", async () => {
        const trackSampleOffset = await wavStreamPlayer.value?.interrupt()
        if (trackSampleOffset?.trackId) {
          const { trackId, offset } = trackSampleOffset
          await realtimeClient.value.cancelResponse(trackId, offset)
        }
      })

      realtimeClient.value.on("conversation.updated", async ({ item, delta }: any) => {
        if (delta?.audio) {
          wavStreamPlayer.value?.add16BitPCM(delta.audio, item.id)
        }
        if (item.status === "completed" && item.formatted.audio?.length) {
          item.formatted.file = await WavRecorder.decode(item.formatted.audio, 24000, 24000)
        }
        realtimeStore.setItems(realtimeClient.value.conversation.getItems())
      })

      realtimeStore.setItems(realtimeClient.value.conversation.getItems())

      onBeforeUnmount(() => {
        realtimeClient.value.reset()
      })
    })

    return {
      // isSidebarOpen,
      startTimestamp,
      clientCanvasRef,
      serverCanvasRef,
      getItems,
      getRealtimeEvents,
      getExpandedEvents: realtimeStore.expandedEvents,
      getMemoryKeyValue: realtimeStore.memoryKeyValue,
      getIsConnected,
      getCanPushToTalk,
      getIsRecording,
      setExpandedEvents,
      formatTimeForLogs,
      deleteConversationItem,
      changeTurnEndType,
      startRecording,
      stopRecording,
      disconnectConversation,
      connectConversation,
    }
  },
})
</script>
