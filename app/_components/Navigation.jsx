import Link from "next/link";
import { Swords, FlaskConical } from "lucide-react";

export default function Navigation() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 group">
          <Swords
            className="h-5 w-5 text-[var(--color-gold)] transition-transform group-hover:rotate-12"
            strokeWidth={1.5}
          />
          <span
            className="font-black tracking-widest text-[var(--color-gold)] text-lg"
            style={{ fontFamily: "'Black Ops One', sans-serif" }}
          >
            LOL<span className="text-[var(--color-text-muted)] mx-1 font-light text-sm">·</span>
            <span className="text-[var(--color-teal)]">MAD</span>
            <span className="text-[var(--color-text-muted)] mx-1 font-light text-sm">·</span>
            MOVIE
          </span>
        </Link>

        {/* 우측 링크 */}
        <nav className="flex items-center gap-1">
          <Link
            href="/lab"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-teal)]"
          >
            <FlaskConical className="h-3.5 w-3.5" />
            Lab
          </Link>
        </nav>
      </div>
    </header>
  );
}
