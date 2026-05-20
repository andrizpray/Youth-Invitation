// Simple in-memory rate limiter
// Works for single-process deployments (Next.js dev / standalone server).
// For multi-instance deployments, replace with a Redis-backed solution.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Check whether a key has exceeded the allowed number of attempts within
 * the given window.
 *
 * @param key      Unique key, e.g. `login:127.0.0.1`
 * @param max      Maximum allowed attempts in the window
 * @param windowMs Window duration in milliseconds
 * @returns `{ limited: true }` when the limit is exceeded, otherwise
 *          `{ limited: false }` and the attempt is recorded.
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): { limited: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    // First attempt in this window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfterMs: 0 };
  }

  if (entry.count >= max) {
    return { limited: true, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { limited: false, retryAfterMs: 0 };
}

// Periodically purge expired entries to avoid unbounded memory growth.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now >= entry.resetAt) store.delete(key);
  }
}, 60_000);
