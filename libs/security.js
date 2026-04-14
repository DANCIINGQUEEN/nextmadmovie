import { NextResponse } from "next/server";

// ── MongoDB Injection Sanitization ──
// Strips keys starting with "$" and nested objects that could be operators
export function sanitize(input) {
  if (input === null || input === undefined) return input;

  if (Array.isArray(input)) {
    return input.map(sanitize);
  }

  if (typeof input === "object") {
    const clean = {};
    for (const [key, value] of Object.entries(input)) {
      if (key.startsWith("$")) continue; // strip MongoDB operators
      clean[key] = sanitize(value);
    }
    return clean;
  }

  // Strings are safe as-is for Mongoose (schema-enforced types)
  return input;
}

// ── Input Validation: Playlist Body ──
const MAX_VIDEOS = 200;
const MAX_TITLE_LENGTH = 500;
const MAX_LINK_LENGTH = 2048;
const DATE_REGEX = /^\d{2}-\d{2}-\d{2}$/;
const YOUTUBE_URL_REGEX = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//;

export function validatePlaylistBody(body) {
  if (!body || typeof body !== "object") {
    return "요청 본문이 올바르지 않습니다.";
  }

  if (!body.date || typeof body.date !== "string" || !DATE_REGEX.test(body.date)) {
    return "날짜 형식이 올바르지 않습니다. (YY-MM-DD)";
  }

  if (!Array.isArray(body.video)) {
    return "video 필드는 배열이어야 합니다.";
  }

  if (body.video.length > MAX_VIDEOS) {
    return `비디오는 최대 ${MAX_VIDEOS}개까지 허용됩니다.`;
  }

  for (const v of body.video) {
    if (!v.title || typeof v.title !== "string" || v.title.length > MAX_TITLE_LENGTH) {
      return `비디오 제목이 올바르지 않습니다. (최대 ${MAX_TITLE_LENGTH}자)`;
    }
    if (!v.link || typeof v.link !== "string" || v.link.length > MAX_LINK_LENGTH) {
      return "비디오 링크가 올바르지 않습니다.";
    }
    if (!YOUTUBE_URL_REGEX.test(v.link)) {
      return "YouTube URL만 허용됩니다.";
    }
  }

  return null;
}

// ── SSRF Protection: URL allowlist ──
const ALLOWED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "nextmadmovie.vercel.app",
]);

export function isUrlAllowed(urlString) {
  try {
    const url = new URL(urlString);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    // Block private/internal IPs except explicitly allowed
    if (ALLOWED_HOSTS.has(url.hostname)) return true;
    // Block common internal ranges
    if (
      url.hostname.startsWith("10.") ||
      url.hostname.startsWith("192.168.") ||
      url.hostname.startsWith("172.") ||
      url.hostname === "0.0.0.0" ||
      url.hostname === "169.254.169.254" // AWS metadata
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ── Audit Logging ──
export function auditLog(action, { method, path, ip, userId, detail } = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    method,
    path,
    ip: ip ?? "unknown",
    userId: userId ?? "anonymous",
    detail: detail ?? null,
  };
  // Structured JSON log for log aggregation (CloudWatch, Datadog, etc.)
  console.log(JSON.stringify({ level: "AUDIT", ...entry }));
  return entry;
}

// ── Safe Error Response (no stack/detail leak) ──
export function safeErrorResponse(error, statusCode = 500) {
  // Log full error server-side
  console.error("[INTERNAL ERROR]", error);

  // Never expose error details to client
  return NextResponse.json(
    { message: "요청 처리 중 오류가 발생했습니다." },
    { status: statusCode }
  );
}

// ── MongoDB ObjectId Validation ──
const OBJECT_ID_REGEX = /^[a-fA-F0-9]{24}$/;

export function isValidObjectId(id) {
  return typeof id === "string" && OBJECT_ID_REGEX.test(id);
}
