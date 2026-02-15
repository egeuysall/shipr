/**
 * Simple in-memory sliding window rate limiter for API routes.
 *
 * Not suitable for multi-instance deployments (use Redis/Upstash instead).
 * Works well for single-instance or Vercel serverless with low traffic.
 *
 * @example
 * ```ts
 * import { rateLimit } from "@/lib/rate-limit";
 *
 * const limiter = rateLimit({ interval: 60_000, limit: 10 });
 *
 * export async function GET(req: Request) {
 *   const ip = req.headers.get("x-forwarded-for") ?? "unknown";
 *   const { success, remaining, reset } = limiter.check(ip);
 *
 *   if (!success) {
 *     return Response.json(
 *       { error: "Too many requests" },
 *       {
 *         status: 429,
 *         headers: {
 *           "X-RateLimit-Remaining": String(remaining),
 *           "X-RateLimit-Reset": String(reset),
 *           "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
 *         },
 *       },
 *     );
 *   }
 *
 *   return Response.json({ ok: true });
 * }
 * ```
 */

interface RateLimitOptions {
  /** Time window in milliseconds (e.g. 60_000 for 1 minute). */
  interval: number;
  /** Max number of requests allowed per interval per key. */
  limit: number;
}

interface RateLimitResult {
  /** Whether the request is allowed. */
  success: boolean;
  /** Number of remaining requests in the current window. */
  remaining: number;
  /** Unix timestamp (ms) when the current window resets. */
  reset: number;
}

interface TokenBucket {
  timestamps: number[];
}

const MAX_CACHE_SIZE = 10_000;

export function rateLimit({ interval, limit }: RateLimitOptions): {
  check: (key: string) => RateLimitResult;
} {
  const buckets = new Map<string, TokenBucket>();

  function cleanup(): void {
    if (buckets.size <= MAX_CACHE_SIZE) return;
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      bucket.timestamps = bucket.timestamps.filter((t) => now - t < interval);
      if (bucket.timestamps.length === 0) {
        buckets.delete(key);
      }
    }
  }

  function check(key: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - interval;

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { timestamps: [] };
      buckets.set(key, bucket);
    }

    // Remove timestamps outside the current window
    bucket.timestamps = bucket.timestamps.filter((t) => t > windowStart);

    if (bucket.timestamps.length >= limit) {
      const oldestInWindow = bucket.timestamps[0] ?? now;
      const reset = oldestInWindow + interval;
      return {
        success: false,
        remaining: 0,
        reset,
      };
    }

    bucket.timestamps.push(now);

    // Periodic cleanup to prevent memory leaks
    cleanup();

    return {
      success: true,
      remaining: limit - bucket.timestamps.length,
      reset: now + interval,
    };
  }

  return { check };
}
