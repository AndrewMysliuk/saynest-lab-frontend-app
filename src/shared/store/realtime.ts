import { computed, reactive, ref } from "vue"
import { defineStore } from "pinia"
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js"
import { IRealtimeEvent } from "@/shared/types"

export const useRealtimeStore = defineStore("realtimeStore", () => {
  const items = ref<ItemType[]>([])
  const realtimeEvents = ref<IRealtimeEvent[]>([])
  const expandedEvents = reactive<Record<string, boolean>>({})
  const memoryKeyValue = reactive<Record<string, any>>({})
  const isConnected = ref<boolean>(false)
  const canPushToTalk = ref<boolean>(true)
  const isRecording = ref<boolean>(false)

  const getItems = computed(() => items.value)
  const getRealtimeEvents = computed(() => realtimeEvents.value)
  const getIsConnected = computed(() => isConnected.value)
  const getCanPushToTalk = computed(() => canPushToTalk.value)
  const getIsRecording = computed(() => isRecording.value)

  const setItems = (newItems: ItemType[]) => {
    items.value = newItems
  }

  const setRealtimeEvents = (newRealtimeEvents: IRealtimeEvent[]) => {
    realtimeEvents.value = newRealtimeEvents
  }

  const setExpandedEvents = (eventId: string) => {
    const expanded = { ...expandedEvents }

    if (expanded[eventId]) {
      delete expanded[eventId]
    } else {
      expanded[eventId] = true
    }

    Object.assign(expandedEvents, expanded)
  }

  const setMemoryKeyValue = (key: string, value: any) => {
    memoryKeyValue.value[key] = value
  }

  const clearMemoryKeyValue = () => {
    Object.keys(memoryKeyValue).forEach((key) => {
      delete memoryKeyValue[key]
    })
  }

  const setIsConnected = (value: boolean) => {
    isConnected.value = value
  }

  const setCanPushToTalk = (value: boolean) => {
    canPushToTalk.value = value
  }

  const setIsRecording = (value: boolean) => {
    isRecording.value = value
  }

  return {
    getItems,
    getRealtimeEvents,
    expandedEvents,
    memoryKeyValue,
    getIsConnected,
    getCanPushToTalk,
    getIsRecording,
    setItems,
    setRealtimeEvents,
    setExpandedEvents,
    setMemoryKeyValue,
    clearMemoryKeyValue,
    setIsConnected,
    setCanPushToTalk,
    setIsRecording,
  }
})
