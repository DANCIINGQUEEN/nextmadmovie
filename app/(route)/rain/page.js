"use client"
import React, { useState, useEffect, useRef } from 'react';
import Modal2 from '@/app/_components/Modal2';
import styles from './page.module.css'

const Marquee = ({ textArray, direction }) => {
  const [count, setCount] = useState(0);
  const marqueeRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const text = textArray.join('\u00A0\u00A0\u00A0\u00A0') + '\u00A0\u00A0\u00A0\u00A0';
    marqueeRef.current.textContent = text.repeat(2);

    const animate = () => {
      setCount((prevCount) => {
        if (!marqueeRef.current) return prevCount;
        if (prevCount > marqueeRef.current.scrollWidth / 2) return 0;
        return prevCount + 1;
      });
      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [textArray]);

  useEffect(() => {
    const scrollHandler = () => setCount((prev) => prev + 15);
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  return (
    <p
      ref={marqueeRef}
      style={{ transform: `translate3d(${direction * count}px, 0, 0)` }}
    />
  );
};

export default function MarqueeComponent() {
  const textArr1 = 'Yummy Tasty Delicious Useful Coding Yummy Yummmmy Yummmmmmmmmy yum'.split(' ');

  return (
    <div className={styles.cover}>
      <Marquee textArray={textArr1} direction={1} />
      <Modal2 />
    </div>
  );
}
