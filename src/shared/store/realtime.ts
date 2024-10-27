import { computed, reactive, ref } from "vue"
import { defineStore } from "pinia"
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js"
import { IRealtimeEvent } from "@/shared/types"

export const useRealtimeStore = defineStore("realtimeStore", () => {
  const items = ref<ItemType[]>([])
  const realtimeEvents = ref<IRealtimeEvent[]>([])
  const expandedEvents = reactive<Record<string, boolean>>({})
  const memoryKeyValue = reactive<{ [key: string]: any }>({})
  const isConnected = ref<boolean>(false)
  const canPushToTalk = ref<boolean>(false)

  const getItems = computed(() => items.value)
  const getRealtimeEvents = computed(() => realtimeEvents.value)
  const getIsConnected = computed(() => isConnected.value)
  const getCanPushToTalk = computed(() => canPushToTalk.value)

  const setItems = (newItems: ItemType[]) => {
    items.value = newItems
  }

  const setRealtimeEvents = (newRealtimeEvent: IRealtimeEvent) => {
    const lastEvent = realtimeEvents.value[realtimeEvents.value.length - 1]

    if (lastEvent?.event.type === newRealtimeEvent.event.type) {
      lastEvent.count = (lastEvent.count || 0) + 1
      realtimeEvents.value = [...realtimeEvents.value.slice(0, -1), lastEvent]
    } else {
      realtimeEvents.value = [...realtimeEvents.value, newRealtimeEvent]
    }
  }

  const clearRealtimeEvents = () => {
    realtimeEvents.value = []
  }

  const setExpandedEvents = (eventId: string) => {
    if (expandedEvents[eventId]) {
      delete expandedEvents[eventId]
    } else {
      expandedEvents[eventId] = true
    }
  }

  const setMemoryKeyValue = (key: string, value: any) => {
    memoryKeyValue.value = { ...memoryKeyValue.value, [key]: value }
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

  return {
    getItems,
    getRealtimeEvents,
    expandedEvents,
    memoryKeyValue,
    getIsConnected,
    getCanPushToTalk,
    setItems,
    setRealtimeEvents,
    clearRealtimeEvents,
    setExpandedEvents,
    setMemoryKeyValue,
    clearMemoryKeyValue,
    setIsConnected,
    setCanPushToTalk,
  }
})
