/**
 * YouTube URL 파싱 로직 테스트
 * YoutubeLink.jsx에서 추출한 파싱 함수를 독립적으로 테스트
 */

function parseVideoCode(link) {
  let videoCode = null;
  try {
    const url = new URL(link.toString());
    videoCode = url.searchParams.get("v");
    if (!videoCode && url.hostname === "youtu.be") {
      videoCode = url.pathname.slice(1);
    }
  } catch {
    videoCode = null;
  }
  return videoCode;
}

describe("YouTube URL 파싱", () => {
  test("일반 watch?v= URL 파싱", () => {
    expect(parseVideoCode("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  test("추가 파라미터가 있는 URL 파싱 (playlist 등)", () => {
    expect(parseVideoCode("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLabc&index=1")).toBe("dQw4w9WgXcQ");
  });

  test("youtu.be 단축 URL 파싱", () => {
    expect(parseVideoCode("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  test("잘못된 URL은 null 반환", () => {
    expect(parseVideoCode("not-a-url")).toBeNull();
  });

  test("v 파라미터 없는 YouTube URL은 null 반환", () => {
    expect(parseVideoCode("https://www.youtube.com/channel/UC123")).toBeNull();
  });

  test("빈 문자열은 null 반환", () => {
    expect(parseVideoCode("")).toBeNull();
  });
});
