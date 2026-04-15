"use client";
import React, { useState, useEffect, useRef } from "react";
import Modal2 from "@/app/_components/Modal2";

const Marquee = ({ textArray, direction }) => {
  const [count, setCount] = useState(0);
  const marqueeRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const text = textArray.join("\u00A0\u00A0\u00A0\u00A0") + "\u00A0\u00A0\u00A0\u00A0";
    marqueeRef.current.textContent = text.repeat(2);

    const animate = () => {
      setCount((prev) => {
        if (!marqueeRef.current) return prev;
        if (prev > marqueeRef.current.scrollWidth / 2) return 0;
        return prev + 1;
      });
      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);
    return () => { if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current); };
  }, [textArray]);

  useEffect(() => {
    const scrollHandler = () => setCount((prev) => prev + 15);
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <p
      ref={marqueeRef}
      className="whitespace-nowrap text-[var(--color-gold)] text-4xl font-black tracking-widest select-none"
      style={{ transform: `translate3d(${direction * count}px, 0, 0)` }}
    />
  );
};

export default function LabPage() {
  const textArr = "Yummy Tasty Delicious Useful Coding Yummy Yummmmy Yummmmmmmmmy yum".split(" ");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-xl font-semibold text-[var(--color-teal)]">Lab</h1>
      <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-10">
        <Marquee textArray={textArr} direction={1} />
        <div className="mt-10 flex justify-center">
          <Modal2 />
        </div>
      </div>
    </div>
  );
}
