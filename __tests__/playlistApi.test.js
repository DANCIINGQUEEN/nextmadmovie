/** @jest-environment node */

jest.mock("../libs/mongodb", () => jest.fn().mockResolvedValue(undefined));

const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockFind = jest.fn();
const mockCount = jest.fn();

jest.mock("../models/playlist", () => ({
  findOne: (...args) => mockFindOne(...args),
  create: (...args) => mockCreate(...args),
  find: (...args) => mockFind(...args),
  countDocuments: (...args) => mockCount(...args),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}));

function makeRequest(body, secret = "test-secret") {
  return {
    headers: { get: (k) => (k === "x-admin-secret" ? secret : null) },
    json: async () => body,
  };
}

describe("POST /api/playlist", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, ADMIN_SECRET: "test-secret" };
    mockFindOne.mockReset();
    mockCreate.mockReset();
    mockFind.mockReset();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test("인증 없이 요청하면 401 반환", async () => {
    const { POST } = require("../app/api/playlist/route");
    const res = await POST(makeRequest({ date: "25-01-01" }, null));
    expect(res.status).toBe(401);
  });

  test("틀린 시크릿으로 요청하면 401 반환", async () => {
    const { POST } = require("../app/api/playlist/route");
    const res = await POST(makeRequest({ date: "25-01-01" }, "wrong"));
    expect(res.status).toBe(401);
  });

  test("올바른 인증 + 새 날짜면 201 반환", async () => {
    mockFindOne.mockResolvedValue(null);
    mockCreate.mockResolvedValue({});

    const { POST } = require("../app/api/playlist/route");
    const res = await POST(makeRequest({ date: "25-01-01", video: [] }));
    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  test("이미 존재하는 날짜면 409 반환", async () => {
    mockFindOne.mockResolvedValue({ date: "25-01-01" });

    const { POST } = require("../app/api/playlist/route");
    const res = await POST(makeRequest({ date: "25-01-01", video: [] }));
    expect(res.status).toBe(409);
    expect(mockCreate).not.toHaveBeenCalled();
  });
});

describe("GET /api/playlist", () => {
  beforeEach(() => {
    mockFind.mockReset();
    mockCount.mockReset();
  });

  test("인증 없이도 GET은 정상 응답", async () => {
    mockFind.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([{ date: "25-01-01" }]),
        }),
      }),
    });
    mockCount.mockResolvedValue(1);

    const { GET } = require("../app/api/playlist/route");
    const res = await GET({ url: "http://localhost/api/playlist" });
    expect(res.status).toBe(200);
  });
});
