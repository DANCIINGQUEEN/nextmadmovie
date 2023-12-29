"use client"
import Link from "next/link";
import styles from "./components.module.css";
import { useState } from "react";

export default function Title({ date }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`https://nextmadmovie.vercel.app/${date}`);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy URL to clipboard", error);
    }
  };

  return (
    <div className={styles.badge}>
      <p>{date}</p>
      &nbsp;
      &nbsp;
      <Link href={`/${date}`}>전체보기</Link>
      <button onClick={copyToClipboard}>
        {copied ? "copied!" : "copy"}
      </button>
    </div>
  );
}

