export type RetryOptions<T> = {
  retries?: number
  delayMs?: number
  onRetry?: (attempt: number, error: unknown, lastParams: T) => void
  adaptParams?: (params: T, attempt: number) => T
}

export async function retryWithAdaptiveParams<T, R>(fn: (params: T, signal?: AbortSignal) => Promise<R>, initialParams: T, options: RetryOptions<T> & { signal?: AbortSignal } = {}): Promise<R> {
  const { retries = 3, delayMs = 0, onRetry = () => {}, adaptParams = (p) => p, signal } = options

  let params = initialParams
  let lastError: unknown

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn(params, signal)
    } catch (error) {
      lastError = error

      if (attempt === retries) break

      onRetry(attempt, error, params)

      params = adaptParams(params, attempt)

      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }

  throw lastError
}
