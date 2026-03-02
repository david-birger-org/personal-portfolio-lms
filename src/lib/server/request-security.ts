import type { NextResponse } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const requestBuckets = new Map<string, RateLimitEntry>();

function cleanupExpiredBuckets(now: number) {
  for (const [key, entry] of requestBuckets) {
    if (entry.resetAt <= now) {
      requestBuckets.delete(key);
    }
  }
}

function getClientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return (
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    headers.get("x-vercel-forwarded-for") ??
    "unknown"
  );
}

export function consumeRateLimit({
  key,
  maxRequests,
  windowMs,
}: {
  key: string;
  maxRequests: number;
  windowMs: number;
}) {
  const now = Date.now();
  cleanupExpiredBuckets(now);

  const entry = requestBuckets.get(key);

  if (!entry || entry.resetAt <= now) {
    requestBuckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    } as const;
  }

  entry.count += 1;

  const remainingMs = Math.max(entry.resetAt - now, 0);

  return {
    allowed: entry.count <= maxRequests,
    retryAfterSeconds: Math.max(Math.ceil(remainingMs / 1000), 1),
  } as const;
}

export function getRateLimitKey(request: Request, route: string) {
  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  return `${route}:${ip}:${userAgent}`;
}

export function isHoneypotTriggered(payload: Record<string, unknown> | null) {
  const website = payload?.website;
  return typeof website === "string" && website.trim().length > 0;
}

export function applyRetryAfterHeader(
  response: NextResponse,
  retryAfterSeconds: number,
) {
  response.headers.set("Retry-After", String(retryAfterSeconds));
  return response;
}
