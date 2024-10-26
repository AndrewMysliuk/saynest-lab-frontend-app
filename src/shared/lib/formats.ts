// Input: 2023-01-01T00:01:05.340Z
// Output: 01:05.34
export const formatTimeForLogs = (start_time: string, timestamp: string): string => {
  const t0 = new Date(start_time).valueOf()
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
