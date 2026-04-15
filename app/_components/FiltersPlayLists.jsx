import Title from "./Title";
import YoutubeLinks from "./YoutubeLinks";

export default function FiltersPlayLists({ playlist, term }) {
  const { date, video } = playlist;

  return (
    <div className="w-full rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-surface)] overflow-hidden">
      {/* Date header — gold tint to indicate search match */}
      <div className="flex items-center gap-3 border-b border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 px-6 py-4">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
        <span className="font-mono text-sm text-[var(--color-gold)]">{date}</span>
        <span className="ml-auto text-xs text-[var(--color-text-dim)]">{video.length}개</span>
      </div>
      <Title date={date} />
      <YoutubeLinks videos={video} term={term} />
    </div>
  );
}
