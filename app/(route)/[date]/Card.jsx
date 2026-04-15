import YoutubeLink from "@/app/_components/YoutubeLink";

export default function Card({ video }) {
  return (
    <div className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-teal)]" />
        <span className="text-sm text-[var(--color-text)]">{video.title}</span>
      </div>
      <div className="flex justify-center p-4">
        <YoutubeLink link={video.link} ratio={0.95} isHome={false} />
      </div>
    </div>
  );
}
