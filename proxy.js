import { NextResponse } from "next/server";

// IP별 요청 횟수 추적 (서버리스 인스턴스 단위 동작)
const rateLimitMap = new Map();

const WINDOW_MS = 60 * 1000; // 1분
const MAX_REQUESTS = 60;      // 분당 60회

function getRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  record.count += 1;
  const remaining = MAX_REQUESTS - record.count;
  return { allowed: record.count <= MAX_REQUESTS, remaining: Math.max(0, remaining) };
}

export function proxy(req) {
  const { pathname } = req.nextUrl;

  // API 라우트에만 적용
  if (!pathname.startsWith("/api")) return NextResponse.next();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, remaining } = getRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { message: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": String(MAX_REQUESTS),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS));
  res.headers.set("X-RateLimit-Remaining", String(remaining));
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
