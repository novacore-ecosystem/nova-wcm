/** Deterministic-ish jitter so mocked list/detail calls feel like a real network round trip. */
export function simulateLatency<T>(value: T, minMs = 180, maxMs = 480): Promise<T> {
  const delay = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
}
