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
              <div class="content-block-body" ref="eventsScrollRef">
                <span v-if="!realtimeEvents.length">awaiting connection...</span>
                <div v-for="realtimeEvent in realtimeEvents" :key="realtimeEvent.event.event_id" class="event">
                  <div class="event-timestamp">{{ formatTime(realtimeEvent.time) }}</div>
                  <div class="event-details">
                    <div class="event-summary" @click="expandedEvents = realtimeEvent.event.event_id">
                      <div :class="['event-source', realtimeEvent.event.type === 'error' ? 'error' : realtimeEvent.source]">
                        <span>
                          {{ realtimeEvent.event.type === "error" ? "error!" : realtimeEvent.source }}
                        </span>
                      </div>
                      <div class="event-type">
                        {{ realtimeEvent.event.type }}<span v-if="realtimeEvent.count"> ({{ realtimeEvent.count }})</span>
                      </div>
                    </div>
                    <div v-if="expandedEvents[realtimeEvent.event.event_id]" class="event-payload">
                      {{ JSON.stringify(realtimeEvent.event, null, 2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="content-block conversation">
              <div class="content-block-title">conversation</div>
              <div class="content-block-body" data-conversation-content>
                <span v-if="!items.length">awaiting connection...</span>
                <div v-for="conversationItem in items" :key="conversationItem.id" class="conversation-item">
                  <div :class="['speaker', conversationItem.role || '']">
                    <div>{{ (conversationItem.role || conversationItem.type).replaceAll("_", " ") }}</div>
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
                v-if="isConnected && canPushToTalk"
                :label="isRecording ? 'release to send' : 'push to talk'"
                :buttonStyle="isRecording ? 'alert' : 'regular'"
                :disabled="!isConnected || !canPushToTalk"
                @mousedown="startRecording"
                @mouseup="stopRecording"
              />
              <div class="spacer" />
              <v-button :label="isConnected ? 'disconnect' : 'connect'" :buttonStyle="isConnected ? 'regular' : 'action'" @click="isConnected ? disconnectConversation() : connectConversation()" />
            </div>
          </div>

          <div class="content-right">
            <div class="content-block kv">
              <div class="content-block-title">set_memory()</div>
              <div class="content-block-body content-kv">
                {{ JSON.stringify(memoryKv, null, 2) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch, nextTick, onMounted, onBeforeUnmount } from "vue"
import { RealtimeClient } from "@openai/realtime-api-beta"
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js"
import { WavRecorder, WavStreamPlayer } from "@/shared/lib"
import { testPrompt as instructions, WavRenderer } from "@/shared/utils"
import { RoomSidebar } from "./ui"

interface RealtimeEvent {
  time: string
  source: "client" | "server"
  count?: number
  event: { [key: string]: any }
}

export default defineComponent({
  components: {
    RoomSidebar,
  },

  setup() {
    // const isSidebarOpen = ref<boolean>(false)
    const wavRecorderRef = ref(new WavRecorder({ sampleRate: 24000 }))
    const wavStreamPlayerRef = ref(new WavStreamPlayer({ sampleRate: 24000 }))
    const clientRef = ref(new RealtimeClient({ url: "http://localhost:3001" }))
    const clientCanvasRef = ref<HTMLCanvasElement | null>(null)
    const serverCanvasRef = ref<HTMLCanvasElement | null>(null)
    const eventsScrollHeightRef = ref(0)
    const eventsScrollRef = ref<HTMLDivElement | null>(null)
    const startTimeRef = ref(new Date().toISOString())
    const items = ref<ItemType[]>([])
    const realtimeEvents = ref<RealtimeEvent[]>([])
    const expandedEvents = reactive<{ [key: string]: boolean }>({})
    const isConnected = ref(false)
    const canPushToTalk = ref(true)
    const isRecording = ref(false)
    const memoryKv = reactive<{ [key: string]: any }>({})

    /**
     * Utility for formatting the timing of logs
     */
    const formatTime = (timestamp: string): string => {
      const t0 = new Date(startTimeRef.value).valueOf()
      const t1 = new Date(timestamp).valueOf()
      const delta = t1 - t0

      const hs = Math.floor(delta / 10) % 100
      const s = Math.floor(delta / 1000) % 60
      const m = Math.floor(delta / 60_000) % 60

      const pad = (n: number) => {
        let s = n.toString()
        while (s.length < 2) {
          s = "0" + s
        }
        return s
      }

      return `${pad(m)}:${pad(s)}.${pad(hs)}`
    }

    /**
     * Connect to conversation:
     * WavRecorder taks speech input, WavStreamPlayer output, client is API client
     */
    const connectConversation = async () => {
      const client = clientRef.value
      const wavRecorder = wavRecorderRef.value
      const wavStreamPlayer = wavStreamPlayerRef.value

      if (!client || !wavRecorder || !wavStreamPlayer) return

      startTimeRef.value = new Date().toISOString()
      isConnected.value = true
      realtimeEvents.value = []
      items.value = client.conversation.getItems()

      await wavRecorder.begin()
      await wavStreamPlayer.connect()
      await client.connect()

      client.sendUserMessageContent([
        {
          type: `input_text`,
          text: `Hello!`,
        },
      ])

      if (client.getTurnDetectionType() === "server_vad") {
        await wavRecorder.record((data) => client.appendInputAudio(data.mono))
      }
    }

    /**
     * Disconnect and reset conversation state
     */
    const disconnectConversation = async () => {
      isConnected.value = false
      realtimeEvents.value = []
      items.value = []
      memoryKv.value = {}

      const client = clientRef.value
      if (client) {
        client.disconnect()
      }

      const wavRecorder = wavRecorderRef.value
      if (wavRecorder) {
        await wavRecorder.end()
      }

      const wavStreamPlayer = wavStreamPlayerRef.value
      if (wavStreamPlayer) {
        await wavStreamPlayer.interrupt()
      }
    }

    const deleteConversationItem = async (id: string) => {
      const client = clientRef.value
      if (client) {
        client.deleteItem(id)
      }
    }

    /**
     * In push-to-talk mode, start recording
     * .appendInputAudio() for each sample
     */
    const startRecording = async () => {
      isRecording.value = true

      const client = clientRef.value
      const wavRecorder = wavRecorderRef.value
      const wavStreamPlayer = wavStreamPlayerRef.value

      if (!client || !wavRecorder || !wavStreamPlayer) return

      // Interrupt the audio stream player and get the track sample offset
      const trackSampleOffset = await wavStreamPlayer.interrupt()

      // If there is an active track, cancel the response
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset
        await client.cancelResponse(trackId, offset)
      }

      // Start recording and append the audio data to the client
      await wavRecorder.record((data) => client.appendInputAudio(data.mono))
    }

    /**
     * In push-to-talk mode, stop recording
     */
    const stopRecording = async () => {
      isRecording.value = false

      const client = clientRef.value
      const wavRecorder = wavRecorderRef.value

      if (!client || !wavRecorder) return

      // Pause the wavRecorder and create a response from the client
      await wavRecorder.pause()
      client.createResponse()
    }

    /**
     * Switch between Manual <> VAD mode for communication
     */
    const changeTurnEndType = async (value: string) => {
      const client = clientRef.value
      const wavRecorder = wavRecorderRef.value

      if (!client || !wavRecorder) return

      // Pause recording if in 'none' mode and currently recording
      if (value === "none" && wavRecorder.getStatus() === "recording") {
        await wavRecorder.pause()
      }

      // Update client session with turn detection type
      client.updateSession({
        turn_detection: value === "none" ? null : { type: "server_vad" },
      })

      // If VAD mode is enabled and client is connected, start recording audio input
      if (value === "server_vad" && client.isConnected()) {
        await wavRecorder.record((data) => client.appendInputAudio(data.mono))
      }

      // Update the state of push-to-talk based on mode
      canPushToTalk.value = value === "none"
    }

    /**
     * Auto-scroll the event logs
     */
    watch(realtimeEvents, () => {
      nextTick(() => {
        if (eventsScrollRef.value) {
          const eventsEl = eventsScrollRef.value
          const scrollHeight = eventsEl.scrollHeight

          // Only scroll if the height has changed
          if (scrollHeight !== eventsScrollHeightRef.value) {
            eventsEl.scrollTop = scrollHeight
            eventsScrollHeightRef.value = scrollHeight
          }
        }
      })
    })

    /**
     * Auto-scroll the conversation logs
     */
    watch(items, () => {
      nextTick(() => {
        // Select all elements with the `data-conversation-content` attribute
        const conversationEls = Array.from(document.body.querySelectorAll("[data-conversation-content]")) as HTMLDivElement[]

        // Auto-scroll each conversation element to the bottom
        for (const conversationEl of conversationEls) {
          conversationEl.scrollTop = conversationEl.scrollHeight
        }
      })
    })

    // Render loop for visualization canvas
    onMounted(() => {
      let isLoaded = true

      const render = () => {
        if (!isLoaded) return

        const clientCanvas = clientCanvasRef.value
        const serverCanvas = serverCanvasRef.value
        const wavRecorder = wavRecorderRef.value
        const wavStreamPlayer = wavStreamPlayerRef.value
        let clientCtx: CanvasRenderingContext2D | null = clientCanvas?.getContext("2d") || null
        let serverCtx: CanvasRenderingContext2D | null = serverCanvas?.getContext("2d") || null

        // Draw on client canvas
        if (clientCanvas && clientCtx) {
          clientCanvas.width ||= clientCanvas.offsetWidth
          clientCanvas.height ||= clientCanvas.offsetHeight
          clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height)

          const result = wavRecorder?.getRecordingStatus() ? wavRecorder.getFrequencies("voice") : { values: new Float32Array([0]) }
          WavRenderer.drawBars(clientCanvas, clientCtx, result.values, "#0099ff", 10, 0, 8)
        }

        // Draw on server canvas
        if (serverCanvas && serverCtx) {
          serverCanvas.width ||= serverCanvas.offsetWidth
          serverCanvas.height ||= serverCanvas.offsetHeight
          serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height)

          const result = wavStreamPlayer?.getAnalyser() ? wavStreamPlayer.getFrequencies("voice") : { values: new Float32Array([0]) }
          WavRenderer.drawBars(serverCanvas, serverCtx, result.values, "#009900", 10, 0, 8)
        }

        window.requestAnimationFrame(render)
      }

      render()

      onBeforeUnmount(() => {
        isLoaded = false
      })
    })

    // Core RealtimeClient and audio capture setup
    onMounted(() => {
      // Set instructions
      clientRef.value.updateSession({ instructions })
      clientRef.value.updateSession({ input_audio_transcription: { model: "whisper-1" } })

      // Add tools
      clientRef.value.addTool(
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
        async ({ key, value }: { [key: string]: any }) => {
          memoryKv[key] = value
          return { ok: true }
        }
      )

      // Handle realtime events for logging and client-server communication
      clientRef.value.on("realtime.event", (realtimeEvent: RealtimeEvent) => {
        const lastEvent = realtimeEvents.value[realtimeEvents.value.length - 1]
        if (lastEvent?.event.type === realtimeEvent.event.type) {
          lastEvent.count = (lastEvent.count || 0) + 1
        } else {
          realtimeEvents.value.push(realtimeEvent)
        }
      })

      clientRef.value.on("error", console.error)

      clientRef.value.on("conversation.interrupted", async () => {
        const trackSampleOffset = await wavStreamPlayerRef.value?.interrupt()
        if (trackSampleOffset?.trackId) {
          const { trackId, offset } = trackSampleOffset
          await clientRef.value.cancelResponse(trackId, offset)
        }
      })

      clientRef.value.on("conversation.updated", async ({ item, delta }: any) => {
        if (delta?.audio) {
          wavStreamPlayerRef.value?.add16BitPCM(delta.audio, item.id)
        }
        if (item.status === "completed" && item.formatted.audio?.length) {
          item.formatted.file = await WavRecorder.decode(item.formatted.audio, 24000, 24000)
        }
        items.value = clientRef.value.conversation.getItems()
      })

      items.value = clientRef.value.conversation.getItems()

      onBeforeUnmount(() => {
        clientRef.value.reset()
      })
    })

    return {
      // isSidebarOpen,
      items,
      memoryKv,
      isConnected,
      canPushToTalk,
      realtimeEvents,
      expandedEvents,
      isRecording,
      formatTime,
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
