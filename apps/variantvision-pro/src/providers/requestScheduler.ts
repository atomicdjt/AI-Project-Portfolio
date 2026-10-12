/** Reserve request start times synchronously so concurrent callers cannot burst. */
export function createRequestScheduler(intervalMs: number) {
  let nextRequestAt = 0
  return async (signal?: AbortSignal | null) => {
    signal?.throwIfAborted()
    const scheduledAt = Math.max(Date.now(), nextRequestAt)
    nextRequestAt = scheduledAt + intervalMs
    const delay = scheduledAt - Date.now()
    if (delay > 0) await new Promise<void>((resolve, reject) => {
      const abort = () => { clearTimeout(timer); reject(signal?.reason ?? new DOMException('Aborted', 'AbortError')) }
      const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve() }, delay)
      signal?.addEventListener('abort', abort, { once: true })
    })
    signal?.throwIfAborted()
  }
}
