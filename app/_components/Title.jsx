"use client"
import Link from "next/link";
import styles from "./components.module.css";
import { useState, useRef, useEffect } from "react";

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
    <div className={styles.badge}>
      <Link href={`/${date}`}>전체보기</Link>
      <button onClick={copyToClipboard}>
        {copied ? "copied!" : "copy"}
      </button>
    </div>
  );
}
