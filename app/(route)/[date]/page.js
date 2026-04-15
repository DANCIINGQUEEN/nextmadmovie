import getPlaylistByDate from "@/libs/getPlayListByDate";
import Card from "./Card";
import Link from "next/link";
import oldPlayLists from "@/libs/oldplaylists";
import { ArrowLeft, Home } from "lucide-react";

const dateSplit = (date) => {
  const dateParts = date.split("-");
  return `${dateParts[0]}년 ${dateParts[1]}월 ${dateParts[2]}일`;
};

export async function generateMetadata({ params }) {
  const { date } = await params;
  const title = `${dateSplit(date)}의 영상들`;
  const desc = `${dateSplit(date)}의 하이라이트`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, site_name: "LOL MAD MOVIE" },
    robots: { index: false, follow: true, nocache: true },
  };
}

export default async function DatePage({ params }) {
  const { date } = await params;
  const title = `${dateSplit(date)}의 영상들`;

  const result = await getPlaylistByDate(date);
  const pl = result?.playlist ?? oldPlayLists.find((p) => p.date === date);

  if (!pl) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-teal)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로
        </Link>
        <p className="text-[var(--color-text-muted)]">플레이리스트를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Back nav */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-teal)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        홈으로
      </Link>

      {/* Page title */}
      <h1 className="mb-6 text-xl font-semibold text-[var(--color-gold)]">{title}</h1>

      {/* Video cards */}
      <div className="flex flex-col gap-4">
        {pl.video.map((video, index) => (
          <Card video={video} key={video._id ?? `${date}-${index}`} />
        ))}
      </div>
    </div>
  );
}
