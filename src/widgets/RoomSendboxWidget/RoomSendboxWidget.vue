<template>
  <div class="room" :class="{ '--sidebar-opened': isSidebarOpen }">
    <transition name="slide-left">
      <RoomSidebarSendbox v-if="isSidebarOpen" :start-timestamp="startTimestamp" @delete-item="deleteConversationItem" />
    </transition>

    <div class="room__body">
      <div>
        <div class="room__title">Realtime Chat</div>

        <div class="room__navbar">
          <div class="room__navbar-switch">
            <v-switch :defaultValue="getCanPushToTalk" :labels="['Push Space Bar To Talk', 'Voice Activity Detection']" :values="['none', 'server_vad']" @change="changeTurnEndType" />
          </div>

          <div class="room__navbar-wrapper">
            <div class="room__navbar-btn">
              <v-button
                :label="getIsConnected ? 'Disconnect' : 'Connect'"
                :buttonStyle="getIsConnected ? 'regular' : 'action'"
                @click="getIsConnected ? disconnectConversation() : connectConversation()"
              />
            </div>

            <div class="room__navbar-btn">
              <v-button label="Toggle History" buttonStyle="regular" @click="isSidebarOpen = !isSidebarOpen" :disabled="!getItems.length" />
            </div>
          </div>
        </div>

        <div class="room__spacebar" v-if="getIsConnected && getCanPushToTalk">
          {{ isSpacePressed ? "Recording... Release the spacebar to stop." : "Press and hold the spacebar to start recording." }}
        </div>
      </div>

      <div class="room__visualization">
        <div class="room__visualization-entry --client">
          <canvas ref="clientCanvasRef" />
        </div>
        <div class="room__visualization-entry --server">
          <canvas ref="serverCanvasRef" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from "vue"
import { RealtimeClient } from "@openai/realtime-api-beta"
import { realtimeStore } from "@/app"
import { WavRecorder, WavStreamPlayer, initializeCanvas } from "@/shared/lib"
import { IRealtimeEvent } from "@/shared/types"
import { RoomSidebarSendbox } from "./ui"

export default defineComponent({
  components: {
    RoomSidebarSendbox,
  },

  setup() {
    let cleanupCanvas: (() => void) | null = null
    const wavRecorder = new WavRecorder({ sampleRate: 24000 })
    const wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 })
    const realtimeClient = new RealtimeClient({ url: "http://localhost:3001" })

    const clientCanvasRef = ref<HTMLCanvasElement | null>(null)
    const serverCanvasRef = ref<HTMLCanvasElement | null>(null)
    const isSidebarOpen = ref<boolean>(false)
    const startTimestamp = ref<string>("")
    const isSpacePressed = ref<boolean>(false)

    const getItems = computed(() => realtimeStore.getItems)

    const getIsConnected = computed(() => realtimeStore.getIsConnected)
    const getCanPushToTalk = computed(() => realtimeStore.getCanPushToTalk)

    const connectConversation = async () => {
      if (!realtimeClient || !wavRecorder || !wavRecorder) return

      startTimestamp.value = new Date().toISOString()
      realtimeStore.setIsConnected(true)
      realtimeStore.clearRealtimeEvents()
      realtimeStore.setItems(realtimeClient.conversation.getItems())

      await wavRecorder.begin()
      await wavStreamPlayer.connect()
      await realtimeClient.connect()

      realtimeClient.sendUserMessageContent([
        {
          type: `input_text`,
          text: `Hello!`,
        },
      ])

      if (realtimeClient.getTurnDetectionType() === "server_vad") {
        await wavRecorder.record((data: any) => realtimeClient.appendInputAudio(data.mono))
      }
    }

    const disconnectConversation = async () => {
      realtimeStore.setIsConnected(false)
      realtimeStore.clearRealtimeEvents()
      realtimeStore.setItems([])
      realtimeStore.clearMemoryKeyValue()

      realtimeClient?.disconnect()
      await wavRecorder?.end()
      await wavStreamPlayer?.interrupt()
    }

    const deleteConversationItem = async (id: string) => {
      realtimeClient?.deleteItem(id)
    }

    const startRecording = async (event: KeyboardEvent) => {
      if (event.code === "Space" && !isSpacePressed.value && getCanPushToTalk.value) {
        isSpacePressed.value = true

        const trackSampleOffset = await wavStreamPlayer.interrupt()

        if (trackSampleOffset?.trackId) {
          const { trackId, offset } = trackSampleOffset
          await realtimeClient.cancelResponse(trackId, offset)
        }

        await wavRecorder.record((data: any) => realtimeClient.appendInputAudio(data.mono))
      }
    }

    const stopRecording = async (event: KeyboardEvent) => {
      if (event.code === "Space" && isSpacePressed.value && getCanPushToTalk.value) {
        isSpacePressed.value = false

        await wavRecorder.pause()
        realtimeClient.createResponse()
      }
    }

    const changeTurnEndType = async (value: string) => {
      if (value === "none" && wavRecorder.getStatus() === "recording") {
        await wavRecorder.pause()
      }

      realtimeClient.updateSession({
        turn_detection: value === "none" ? null : { type: "server_vad" },
      })

      if (value === "server_vad" && realtimeClient.isConnected()) {
        await wavRecorder.record((data: any) => realtimeClient.appendInputAudio(data.mono))
      }

      realtimeStore.setCanPushToTalk(value === "none")
    }

    const initializeRealtimeClient = () => {
      // realtimeClient.updateSession({ instructions })
      realtimeClient.updateSession({ input_audio_transcription: { model: "whisper-1" } })
      realtimeClient.addTool(
        {
          name: "set_memory",
          description: "Saves important data about the user into memory.",
          parameters: {
            type: "object",
            properties: {
              key: {
                type: "string",
                description: "The key of the memory value. Always use lowercase and underscores, no other characters.",
              },
              value: {
                type: "string",
                description: "Value can be anything represented as a string",
              },
            },
            required: ["key", "value"],
          },
        },
        async ({ key, value }: { [key: string]: any }) => {
          realtimeStore.setMemoryKeyValue(key, value)
          return { ok: true }
        }
      )

      realtimeClient.on("realtime.event", (realtimeEvent: IRealtimeEvent) => {
        realtimeStore.setRealtimeEvents(realtimeEvent)
      })

      realtimeClient.on("error", console.error)

      realtimeClient.on("conversation.interrupted", async () => {
        const trackSampleOffset = await wavStreamPlayer?.interrupt()
        if (trackSampleOffset?.trackId) {
          const { trackId, offset } = trackSampleOffset
          await realtimeClient.cancelResponse(trackId, offset)
        }
      })

      realtimeClient.on("conversation.updated", async ({ item, delta }: any) => {
        const items = realtimeClient.conversation.getItems()
        if (delta?.audio) {
          wavStreamPlayer?.add16BitPCM(delta.audio, item.id)
        }
        if (item.status === "completed" && item.formatted.audio?.length) {
          item.formatted.file = await WavRecorder.decode(item.formatted.audio, 24000, 24000)
        }
        realtimeStore.setItems(items)
      })

      realtimeStore.setItems(realtimeClient.conversation.getItems())
    }

    onMounted(() => {
      initializeRealtimeClient()
      cleanupCanvas = initializeCanvas(clientCanvasRef.value, serverCanvasRef.value, wavRecorder, wavStreamPlayer)

      window.addEventListener("keydown", startRecording)
      window.addEventListener("keyup", stopRecording)
    })

    onBeforeUnmount(() => {
      cleanupCanvas?.()
      realtimeClient.reset()
      window.removeEventListener("keydown", startRecording)
      window.removeEventListener("keyup", stopRecording)
    })

    return {
      isSidebarOpen,
      startTimestamp,
      clientCanvasRef,
      serverCanvasRef,
      isSpacePressed,
      getItems,
      getIsConnected,
      getCanPushToTalk,
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
