import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({ currentPage, maxPage, onChangePage }) {
  const pagesToShow = () => {
    const pages = [];
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i > 0 && i <= maxPage) pages.push(i);
    }
    return pages;
  };

  const btnBase =
    "flex items-center justify-center rounded border p-[10px] mx-[5px] mt-[10px] mb-[30px] text-sm transition-colors disabled:opacity-30";
  const btnIdle =
    "border-[var(--color-border)] bg-transparent text-[var(--color-text-muted)] hover:border-[var(--color-border-bright)] hover:text-[var(--color-text)]";
  const btnActive =
    "border-[var(--color-gold)]/60 bg-[var(--color-gold)]/10 text-[var(--color-gold)] font-bold underline";

  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      <button
        className={cn(btnBase, btnIdle)}
        onClick={() => onChangePage(1)}
        disabled={currentPage === 1}
        aria-label="First page"
      >
        <ChevronsLeft className="h-3.5 w-3.5" />
      </button>
      <button
        className={cn(btnBase, btnIdle)}
        onClick={() => onChangePage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>

      {pagesToShow().map((page) => (
        <button
          key={page}
          className={cn(btnBase, currentPage === page ? btnActive : btnIdle)}
          onClick={() => onChangePage(page)}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        className={cn(btnBase, btnIdle)}
        onClick={() => onChangePage(currentPage + 1)}
        disabled={currentPage === maxPage}
        aria-label="Next page"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
      <button
        className={cn(btnBase, btnIdle)}
        onClick={() => onChangePage(maxPage)}
        disabled={currentPage === maxPage}
        aria-label="Last page"
      >
        <ChevronsRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
