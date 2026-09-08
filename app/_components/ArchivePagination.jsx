import { ChevronLeft, ChevronRight } from "lucide-react";
export default function Pagination({
  page,
  total,
  onChange
}) {
  if (total < 1) return null;
  const start = Math.max(1, Math.min(page - 2, total - 4));
  return <nav className="pagination" aria-label="페이지 이동"><button disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="이전 페이지"><ChevronLeft size={17} /></button>{Array.from({
      length: Math.min(5, total)
    }, (_, i) => start + i).map(number => <button key={number} aria-current={number === page ? "page" : undefined} onClick={() => onChange(number)}>{number}</button>)}<button disabled={page === total} onClick={() => onChange(page + 1)} aria-label="다음 페이지"><ChevronRight size={17} /></button></nav>;
}
