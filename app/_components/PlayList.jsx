"use client";
import YoutubeLinks from "./YoutubeLinks";
import Title from "./Title";

export default function PlayList({ playlist }) {
  const { date, video } = playlist;

  return (
    <div className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      {/* Date header */}
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
        <span className="font-mono text-sm text-[var(--color-gold)]">{date}</span>
        <span className="ml-auto text-xs text-[var(--color-text-dim)]">{video.length}개</span>
      </div>
      {/* Actions */}
      <Title date={date} />
      {/* Video buttons */}
      <YoutubeLinks videos={video} />
    </div>
  );
}
