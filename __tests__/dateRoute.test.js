/** @jest-environment node */

jest.mock("../libs/mongodb", () => jest.fn().mockResolvedValue(undefined));

const mockFindOne = jest.fn();
jest.mock("../models/playlist", () => ({
  findOne: (...args) => mockFindOne(...args),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}));

describe("GET /api/playlist/[date]", () => {
  beforeEach(() => mockFindOne.mockReset());

  const makeReq = () => ({});

  test("올바른 날짜 형식 (YY-MM-DD) - 200", async () => {
    mockFindOne.mockResolvedValue({ date: "25-01-01" });
    const { GET } = require("../app/api/playlist/[date]/route");
    const res = await GET(makeReq(), { params: { date: "25-01-01" } });
    expect(res.status).toBe(200);
  });

  test("잘못된 날짜 형식 (YYYY-MM-DD) - 400", async () => {
    const { GET } = require("../app/api/playlist/[date]/route");
    const res = await GET(makeReq(), { params: { date: "2025-01-01" } });
    expect(res.status).toBe(400);
    expect(mockFindOne).not.toHaveBeenCalled();
  });

  test("SQL injection 시도 - 400", async () => {
    const { GET } = require("../app/api/playlist/[date]/route");
    const res = await GET(makeReq(), { params: { date: "'; DROP TABLE playlists; --" } });
    expect(res.status).toBe(400);
    expect(mockFindOne).not.toHaveBeenCalled();
  });

  test("빈 문자열 - 400", async () => {
    const { GET } = require("../app/api/playlist/[date]/route");
    const res = await GET(makeReq(), { params: { date: "" } });
    expect(res.status).toBe(400);
  });
});
