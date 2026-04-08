/** @jest-environment node */

// NextResponse mock
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}));

const { checkAdminSecret } = require("../libs/apiAuth");

function makeRequest(secret) {
  return {
    headers: {
      get: (key) => (key === "x-admin-secret" ? secret : null),
    },
  };
}

describe("checkAdminSecret", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, ADMIN_SECRET: "test-secret-123" };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test("올바른 시크릿이면 null 반환 (통과)", () => {
    const result = checkAdminSecret(makeRequest("test-secret-123"));
    expect(result).toBeNull();
  });

  test("틀린 시크릿이면 401 반환", () => {
    const result = checkAdminSecret(makeRequest("wrong-secret"));
    expect(result.status).toBe(401);
  });

  test("헤더가 없으면 401 반환", () => {
    const result = checkAdminSecret(makeRequest(null));
    expect(result.status).toBe(401);
  });

  test("ADMIN_SECRET 환경변수가 없으면 500 반환", () => {
    delete process.env.ADMIN_SECRET;
    const result = checkAdminSecret(makeRequest("any-secret"));
    expect(result.status).toBe(500);
  });
});
