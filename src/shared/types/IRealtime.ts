export enum RealtimeEventSourceEnum {
  CLIENT = "client",
  SERVER = "server",
}

export interface IRealtimeEvent {
  time: string
  source: RealtimeEventSourceEnum
  count?: number
  event: { [key: string]: any }
}
