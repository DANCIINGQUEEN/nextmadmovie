/** @jest-environment node */

// Mock NextResponse before importing middleware
const mockNextResponseNext = jest.fn(() => ({
  headers: new Map(),
}));

jest.mock("next/server", () => {
  class MockNextResponse {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status ?? 200;
      this.headers = new Map();
      if (init.headers) {
        Object.entries(init.headers).forEach(([k, v]) => this.headers.set(k, v));
      }
    }

    static json(body, init = {}) {
      const res = new MockNextResponse(JSON.stringify(body), init);
      res.jsonBody = body;
      return res;
    }

    static next() {
      return mockNextResponseNext();
    }
  }

  // Attach the class to the function for instanceof checks
  MockNextResponse.next = () => {
    const res = new MockNextResponse(null, { status: 200 });
    return res;
  };

  return { NextResponse: MockNextResponse };
});

const { middleware } = require("../middleware");

function makeReq({ pathname = "/api/playlist", method = "GET", origin = null, ip = "127.0.0.1", secret = null } = {}) {
  const headers = new Map();
  if (origin) headers.set("origin", origin);
  if (ip) headers.set("x-forwarded-for", ip);
  if (secret) headers.set("x-admin-secret", secret);

  return {
    method,
    nextUrl: { pathname },
    headers: {
      get: (key) => headers.get(key) ?? null,
    },
  };
}

describe("Middleware – CORS", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, ALLOWED_ORIGINS: "http://localhost:3000" };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test("OPTIONS preflight 허용된 origin → 204 + CORS 헤더", () => {
    const res = middleware(makeReq({ method: "OPTIONS", origin: "http://localhost:3000" }));
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:3000");
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("GET");
  });

  test("OPTIONS preflight 허용되지 않은 origin → 403", () => {
    const res = middleware(makeReq({ method: "OPTIONS", origin: "https://evil.com" }));
    expect(res.status).toBe(403);
  });
});

describe("Middleware – CSRF", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, ALLOWED_ORIGINS: "http://localhost:3000" };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test("POST with 허용되지 않은 origin → 403 CSRF 차단", () => {
    const res = middleware(makeReq({ method: "POST", origin: "https://evil.com", ip: "99.99.99.1" }));
    expect(res.status).toBe(403);
    expect(res.jsonBody.message).toContain("CSRF");
  });

  test("POST with 허용된 origin → 통과", () => {
    const res = middleware(makeReq({ method: "POST", origin: "http://localhost:3000", ip: "99.99.99.2" }));
    // Should not be 403
    expect(res.status).not.toBe(403);
  });

  test("GET 요청은 CSRF 검사 안 함", () => {
    const res = middleware(makeReq({ method: "GET", origin: "https://evil.com", ip: "99.99.99.3" }));
    expect(res.status).not.toBe(403);
  });

  test("origin/referer 없는 서버사이드 호출은 통과", () => {
    const res = middleware(makeReq({ method: "POST", origin: null, ip: "99.99.99.4" }));
    expect(res.status).not.toBe(403);
  });
});

describe("Middleware – Rate Limiting", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, ALLOWED_ORIGINS: "http://localhost:3000" };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test("60회 초과 시 429 반환", () => {
    const testIp = "rate-limit-test-" + Date.now();
    let res;
    for (let i = 0; i < 61; i++) {
      res = middleware(makeReq({ ip: testIp }));
    }
    expect(res.status).toBe(429);
    expect(res.jsonBody.message).toContain("요청");
  });
});

describe("Middleware – Security Headers", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, ALLOWED_ORIGINS: "http://localhost:3000" };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test("응답에 보안 헤더 포함", () => {
    const uniqueIp = "header-test-" + Date.now();
    const res = middleware(makeReq({ ip: uniqueIp }));
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("Strict-Transport-Security")).toContain("max-age=");
  });
});

describe("Middleware – Non-API 경로 무시", () => {
  test("/about 같은 비-API 경로는 바이패스", () => {
    // Non-API paths should call NextResponse.next()
    const res = middleware(makeReq({ pathname: "/about", ip: "bypass-" + Date.now() }));
    // The middleware returns NextResponse.next() for non-api paths
    // which in our mock returns the mock object
    expect(res).toBeDefined();
  });
});
