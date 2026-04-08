/** @jest-environment node */

jest.mock("../libs/mongodb", () => jest.fn().mockResolvedValue(undefined));
jest.mock("../libs/apiAuth", () => ({ checkAdminSecret: jest.fn().mockReturnValue(null) }));

const mockFind = jest.fn();
const mockCount = jest.fn();

jest.mock("../models/playlist", () => ({
  find: (...args) => mockFind(...args),
  countDocuments: (...args) => mockCount(...args),
}));

function chainedFind(docs) {
  mockFind.mockReturnValue({
    sort: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(docs),
      }),
    }),
  });
}

async function getBody(res) {
  if (typeof res.json === "function" && res.body === undefined) {
    // jest mock의 경우: res.body가 이미 객체
    return res.body;
  }
  // 실제 NextResponse의 경우: Response.json() 호출
  return res.json();
}

describe("GET /api/playlist 페이지네이션", () => {
  beforeEach(() => {
    mockFind.mockReset();
    mockCount.mockReset();
  });

  test("기본값: page=1, limit=20 반환", async () => {
    const docs = Array.from({ length: 20 }, (_, i) => ({ date: `25-01-${i + 1}` }));
    chainedFind(docs);
    mockCount.mockResolvedValue(50);

    const { GET } = require("../app/api/playlist/route");
    const res = await GET({ url: "http://localhost/api/playlist" });
    const body = await getBody(res);

    expect(res.status).toBe(200);
    expect(body.pagination).toEqual({ page: 1, limit: 20, total: 50, totalPages: 3 });
  });

  test("limit 999 → 최대값 100으로 제한", async () => {
    chainedFind([]);
    mockCount.mockResolvedValue(0);

    const { GET } = require("../app/api/playlist/route");
    const res = await GET({ url: "http://localhost/api/playlist?limit=999" });
    const body = await getBody(res);

    expect(body.pagination.limit).toBe(100);
  });

  test("page=-5 → 1로 처리", async () => {
    chainedFind([]);
    mockCount.mockResolvedValue(0);

    const { GET } = require("../app/api/playlist/route");
    const res = await GET({ url: "http://localhost/api/playlist?page=-5" });
    const body = await getBody(res);

    expect(body.pagination.page).toBe(1);
  });

  test("page=2, limit=10 → pagination 메타데이터 정확", async () => {
    chainedFind([]);
    mockCount.mockResolvedValue(45);

    const { GET } = require("../app/api/playlist/route");
    const res = await GET({ url: "http://localhost/api/playlist?page=2&limit=10" });
    const body = await getBody(res);

    expect(body.pagination).toEqual({ page: 2, limit: 10, total: 45, totalPages: 5 });
  });
});
