import YoutubeLink from "./YoutubeLink";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export default function YoutubeLinks({ videos, term = "" }) {
  const getVariant = (title) => {
    if (term && title.toLowerCase().includes(term.toLowerCase())) return "match";
    if (title.includes("펜타")) return "penta";
    if (title.includes("쿼드라")) return "quadra";
    return "normal";
  };

  const variantClass = {
    match:  "border-[var(--color-gold)]/60 bg-[var(--color-gold)]/10 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/20",
    penta:  "border-[var(--color-penta)]/50 bg-[var(--color-penta)]/10 text-[var(--color-penta)] hover:bg-[var(--color-penta)]/20",
    quadra: "border-[var(--color-quadra)]/40 bg-[var(--color-quadra)]/10 text-[var(--color-quadra)] hover:bg-[var(--color-quadra)]/20",
    normal: "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]",
  };

  return (
    <ul className="flex flex-wrap gap-2 px-6 pb-6 pt-1">
      {videos.map((video, index) => {
        const variant = getVariant(video.title);
        return (
          <li key={video._id ?? `${video.title}-${index}`}>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className={`rounded border px-4 py-2 text-sm font-medium transition-colors ${variantClass[variant]}`}
                >
                  {video.title}
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="sr-only">{video.title}</DialogTitle>
                <YoutubeLink link={video.link} ratio={0.9} isHome={true} />
              </DialogContent>
            </Dialog>
          </li>
        );
      })}
    </ul>
  );
}
