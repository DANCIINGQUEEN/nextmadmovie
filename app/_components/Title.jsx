"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Link2, Check } from "lucide-react";

export default function Title({ date }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`https://nextmadmovie.vercel.app/${date}`);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL to clipboard", error);
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <Link
        href={`/${date}`}
        className="text-xs text-[var(--color-teal)] hover:text-[var(--color-gold)] transition-colors underline underline-offset-2"
      >
        전체보기
      </Link>
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="h-3 w-3 text-[var(--color-teal)]" />
        ) : (
          <Link2 className="h-3 w-3" />
        )}
        <span>{copied ? "copied!" : "copy"}</span>
      </button>
    </div>
  );
}
