import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ interval: 60_000, limit: 30 });

export function GET(req: Request): NextResponse {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success, remaining, reset } = limiter.check(ip);

  const headers = {
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(reset),
  };

  if (!success) {
    return NextResponse.json(
      { status: "error", message: "Too many requests" },
      {
        status: 429,
        headers: {
          ...headers,
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        },
      },
    );
  }

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    { status: 200, headers },
  );
}
