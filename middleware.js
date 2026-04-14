import { NextResponse } from "next/server";

// ── Rate Limit (in-memory, per serverless instance) ──
const rateLimitMap = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;

function getClientIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  record.count += 1;
  return {
    allowed: record.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - record.count),
  };
}

// ── CORS ──
const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:3000"];

function getAllowedOrigins() {
  const env = process.env.ALLOWED_ORIGINS;
  if (env) return env.split(",").map((o) => o.trim());
  return DEFAULT_ALLOWED_ORIGINS;
}

function isOriginAllowed(origin) {
  if (!origin) return false;
  return getAllowedOrigins().includes(origin);
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-secret",
    "Access-Control-Max-Age": "86400",
  };
}

// ── CSRF: Origin / Referer check for mutating requests ──
const MUTATING_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

function checkCsrf(req) {
  if (!MUTATING_METHODS.has(req.method)) return null;

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const allowed = getAllowedOrigins();

  // Server-side calls (no origin/referer) are allowed (e.g., Next.js server actions)
  if (!origin && !referer) return null;

  if (origin && allowed.includes(origin)) return null;
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (allowed.includes(refOrigin)) return null;
    } catch {
      // invalid referer URL
    }
  }

  return NextResponse.json(
    { message: "CSRF 검증 실패: 허용되지 않은 출처" },
    { status: 403 }
  );
}

// ── Main Middleware ──
export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only apply to API routes
  if (!pathname.startsWith("/api")) return NextResponse.next();

  const origin = req.headers.get("origin");
  const validOrigin = isOriginAllowed(origin) ? origin : null;

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    if (!validOrigin) {
      return new NextResponse(null, { status: 403 });
    }
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(validOrigin),
    });
  }

  // Rate limiting
  const ip = getClientIp(req);
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    const res = NextResponse.json(
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
    if (validOrigin) {
      Object.entries(corsHeaders(validOrigin)).forEach(([k, v]) =>
        res.headers.set(k, v)
      );
    }
    return res;
  }

  // CSRF check
  const csrfError = checkCsrf(req);
  if (csrfError) {
    if (validOrigin) {
      Object.entries(corsHeaders(validOrigin)).forEach(([k, v]) =>
        csrfError.headers.set(k, v)
      );
    }
    return csrfError;
  }

  // Pass through with rate-limit + CORS + security headers
  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS));
  res.headers.set("X-RateLimit-Remaining", String(remaining));
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  res.headers.set("X-XSS-Protection", "0");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (validOrigin) {
    Object.entries(corsHeaders(validOrigin)).forEach(([k, v]) =>
      res.headers.set(k, v)
    );
  }

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
