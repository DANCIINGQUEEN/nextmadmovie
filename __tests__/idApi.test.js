/** @jest-environment node */

jest.mock("../libs/mongodb", () => jest.fn().mockResolvedValue(undefined));

const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();

jest.mock("../models/playlist", () => ({
  findByIdAndUpdate: (...args) => mockFindByIdAndUpdate(...args),
  findByIdAndDelete: (...args) => mockFindByIdAndDelete(...args),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}));

const VALID_ID = "507f1f77bcf86cd799439011"; // valid ObjectId

function makeRequest(body, secret = "test-secret") {
  return {
    headers: { get: (k) => (k === "x-admin-secret" ? secret : null) },
    json: async () => body,
  };
}

describe("PUT /api/[id]", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, ADMIN_SECRET: "test-secret" };
    mockFindByIdAndUpdate.mockReset();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test("인증 없으면 401", async () => {
    const { PUT } = require("../app/api/[id]/route");
    const res = await PUT(makeRequest({}, null), { params: { id: VALID_ID } });
    expect(res.status).toBe(401);
  });

  test("올바른 인증이면 수정 후 200", async () => {
    mockFindByIdAndUpdate.mockResolvedValue({ _id: VALID_ID });

    const { PUT } = require("../app/api/[id]/route");
    const res = await PUT(makeRequest({ date: "25-01-02" }), { params: { id: VALID_ID } });
    expect(res.status).toBe(200);
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(VALID_ID, { date: "25-01-02" });
  });

  test("잘못된 ObjectId 형식이면 400", async () => {
    const { PUT } = require("../app/api/[id]/route");
    const res = await PUT(makeRequest({ date: "25-01-02" }), { params: { id: "invalid-id!" } });
    expect(res.status).toBe(400);
    expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  test("MongoDB 연산자($set 등)가 제거됨", async () => {
    mockFindByIdAndUpdate.mockResolvedValue({ _id: VALID_ID });

    const { PUT } = require("../app/api/[id]/route");
    const res = await PUT(
      makeRequest({ date: "25-01-02", $set: { admin: true } }),
      { params: { id: VALID_ID } }
    );
    expect(res.status).toBe(200);
    // $set should be stripped, only whitelisted fields remain
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(VALID_ID, { date: "25-01-02" });
  });
});

describe("DELETE /api/[id]", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, ADMIN_SECRET: "test-secret" };
    mockFindByIdAndDelete.mockReset();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test("인증 없으면 401", async () => {
    const { DELETE } = require("../app/api/[id]/route");
    const res = await DELETE(makeRequest(null, null), { params: { id: VALID_ID } });
    expect(res.status).toBe(401);
  });

  test("올바른 인증이면 삭제 후 200", async () => {
    mockFindByIdAndDelete.mockResolvedValue({ _id: VALID_ID });

    const { DELETE } = require("../app/api/[id]/route");
    const res = await DELETE(makeRequest(null), { params: { id: VALID_ID } });
    expect(res.status).toBe(200);
    expect(mockFindByIdAndDelete).toHaveBeenCalledWith(VALID_ID);
  });

  test("잘못된 ObjectId 형식이면 400", async () => {
    const { DELETE } = require("../app/api/[id]/route");
    const res = await DELETE(makeRequest(null), { params: { id: "not-valid" } });
    expect(res.status).toBe(400);
    expect(mockFindByIdAndDelete).not.toHaveBeenCalled();
  });
});
