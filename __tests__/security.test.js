/** @jest-environment node */

// ── sanitize ──
const { sanitize, validatePlaylistBody, isUrlAllowed, isValidObjectId, auditLog, safeErrorResponse } = require("../libs/security");

describe("sanitize – MongoDB injection 방어", () => {
  test("$ 접두사 키를 제거", () => {
    const input = { date: "25-01-01", $gt: "", $set: { admin: true } };
    const result = sanitize(input);
    expect(result).toEqual({ date: "25-01-01" });
    expect(result.$gt).toBeUndefined();
    expect(result.$set).toBeUndefined();
  });

  test("중첩된 $ 키도 제거", () => {
    const input = { video: [{ title: "test", $where: "1==1", link: "x" }] };
    const result = sanitize(input);
    expect(result.video[0].$where).toBeUndefined();
    expect(result.video[0].title).toBe("test");
  });

  test("일반 객체는 그대로 통과", () => {
    const input = { date: "25-01-01", video: [{ title: "a", link: "b" }] };
    expect(sanitize(input)).toEqual(input);
  });

  test("null/undefined 그대로 반환", () => {
    expect(sanitize(null)).toBeNull();
    expect(sanitize(undefined)).toBeUndefined();
  });

  test("문자열/숫자는 그대로 반환", () => {
    expect(sanitize("hello")).toBe("hello");
    expect(sanitize(42)).toBe(42);
  });
});

// ── validatePlaylistBody ──
describe("validatePlaylistBody – 입력 검증", () => {
  const validBody = {
    date: "25-01-01",
    video: [{ title: "Test", link: "https://www.youtube.com/watch?v=abc123" }],
  };

  test("올바른 본문은 null 반환", () => {
    expect(validatePlaylistBody(validBody)).toBeNull();
  });

  test("본문이 없으면 에러", () => {
    expect(validatePlaylistBody(null)).toBeTruthy();
    expect(validatePlaylistBody(undefined)).toBeTruthy();
  });

  test("날짜 형식이 틀리면 에러", () => {
    expect(validatePlaylistBody({ ...validBody, date: "2025-01-01" })).toBeTruthy();
    expect(validatePlaylistBody({ ...validBody, date: "" })).toBeTruthy();
  });

  test("video가 배열이 아니면 에러", () => {
    expect(validatePlaylistBody({ ...validBody, video: "not array" })).toBeTruthy();
  });

  test("비디오 제목이 너무 길면 에러", () => {
    const longTitle = "a".repeat(501);
    expect(
      validatePlaylistBody({
        ...validBody,
        video: [{ title: longTitle, link: "https://www.youtube.com/watch?v=x" }],
      })
    ).toBeTruthy();
  });

  test("YouTube이 아닌 URL은 거부", () => {
    expect(
      validatePlaylistBody({
        ...validBody,
        video: [{ title: "t", link: "https://evil.com/malware" }],
      })
    ).toBeTruthy();
  });

  test("비디오 200개 초과 시 거부", () => {
    const videos = Array.from({ length: 201 }, (_, i) => ({
      title: `v${i}`,
      link: "https://www.youtube.com/watch?v=abc",
    }));
    expect(validatePlaylistBody({ date: "25-01-01", video: videos })).toBeTruthy();
  });
});

// ── isUrlAllowed – SSRF 방어 ──
describe("isUrlAllowed – SSRF 방어", () => {
  test("허용된 호스트 통과", () => {
    expect(isUrlAllowed("http://localhost:3000/api")).toBe(true);
    expect(isUrlAllowed("https://nextmadmovie.vercel.app/api")).toBe(true);
  });

  test("AWS 메타데이터 엔드포인트 차단", () => {
    expect(isUrlAllowed("http://169.254.169.254/latest/meta-data/")).toBe(false);
  });

  test("내부 IP 차단", () => {
    expect(isUrlAllowed("http://10.0.0.1/admin")).toBe(false);
    expect(isUrlAllowed("http://192.168.1.1/")).toBe(false);
  });

  test("file:// 프로토콜 차단", () => {
    expect(isUrlAllowed("file:///etc/passwd")).toBe(false);
  });

  test("잘못된 URL은 false", () => {
    expect(isUrlAllowed("not-a-url")).toBe(false);
  });
});

// ── isValidObjectId ──
describe("isValidObjectId", () => {
  test("유효한 ObjectId", () => {
    expect(isValidObjectId("507f1f77bcf86cd799439011")).toBe(true);
  });

  test("잘못된 ObjectId", () => {
    expect(isValidObjectId("abc")).toBe(false);
    expect(isValidObjectId("xyz-not-valid-id-here!!")).toBe(false);
    expect(isValidObjectId(123)).toBe(false);
    expect(isValidObjectId(null)).toBe(false);
  });
});

// ── auditLog ──
describe("auditLog – 감사 로깅", () => {
  test("구조화된 로그 엔트리 반환", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    const entry = auditLog("TEST_ACTION", {
      method: "POST",
      path: "/api/test",
      ip: "1.2.3.4",
    });

    expect(entry.action).toBe("TEST_ACTION");
    expect(entry.method).toBe("POST");
    expect(entry.ip).toBe("1.2.3.4");
    expect(entry.timestamp).toBeDefined();
    expect(spy).toHaveBeenCalledTimes(1);

    const loggedJson = JSON.parse(spy.mock.calls[0][0]);
    expect(loggedJson.level).toBe("AUDIT");

    spy.mockRestore();
  });
});

// ── safeErrorResponse – 에러 노출 차단 ──
describe("safeErrorResponse – 에러 노출 차단", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  test("에러 상세를 클라이언트에 노출하지 않음", () => {
    jest.isolateModules(() => {
      jest.mock("next/server", () => ({
        NextResponse: {
          json: jest.fn((body, init) => ({ body, status: init?.status ?? 200 })),
        },
      }));

      const { safeErrorResponse } = require("../libs/security");
      const res = safeErrorResponse(new Error("SECRET DB PASSWORD LEAK"));
      expect(res.status).toBe(500);
      expect(res.body.message).not.toContain("SECRET");
      expect(res.body.message).toBe("요청 처리 중 오류가 발생했습니다.");
    });
  });
});
