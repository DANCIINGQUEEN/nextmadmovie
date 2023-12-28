"use client"
// import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css'

// const MarqueeText = ({ textArray, reverse }) => {
//   const [count, setCount] = useState(0);
//   const pTagRef = useRef(null);

//   useEffect(() => {
//     initTexts(pTagRef.current, textArray);

//     const animate = () => {
//       setCount((prevCount) => {
//         const newCount = prevCount + 1;
//         marqueeText(newCount, pTagRef.current, reverse ? -1 : 1);
//         return newCount;
//       });

//       requestAnimationFrame(animate);
//     };

//     // 애니메이션 시작
//     const rafId = requestAnimationFrame(animate);

//     // 클린업 함수에서 애니메이션 취소
//     return () => cancelAnimationFrame(rafId);
//   }, [textArray, reverse]);

//   useEffect(() => {
//     const scrollHandler = () => {
//       setCount((prevCount) => prevCount + 15);
//     };

//     // 스크롤 이벤트 리스너 등록
//     window.addEventListener('scroll', scrollHandler);

//     // 클린업 함수에서 이벤트 리스너 제거
//     return () => window.removeEventListener('scroll', scrollHandler);
//   }, []);

//   return (
//     <div className={styles.cover}>
//       <p className={styles.content} style={{fontSize:'1rem'}} ref={pTagRef}></p>
//     </div>
//   );
// };

// const initTexts = (element, textArray) => {
//   textArray.push(...textArray);
//   element.innerText = textArray.join('\u00A0\u00A0\u00A0\u00A0');
// };

// const marqueeText = (count, element, direction) => {
//   if (count > element.scrollWidth / 2) {
//     element.style.transform = 'translate3d(0, 0, 0)';
//     count =0
//   }
//   element.style.transform = `translate3d(${direction * count}px, 0, 0)`;
//   return count
// };

// export default function Rain() {
//   const textArr1 = 'Yummy Tasty Delicious Useful Coding Yummy Yummmmy Yummmmmmmmmy yum'.split(' ');
//   const textArr2 = 'Chicken Hamburger Pizza Salad Sushi Bibimbab Gimbab JJajangmyeon'.split(' ');
//   const textArr3 = "Let's Dive Into This Tutorial Take It Easy! Don't Worry".split(' ');
//   const textArr4 = 'Pure Moral Conscientious Meritorious Worthy Exemplary Upright '.split(' ');

//   return (
//     <>
//       <MarqueeText textArray={textArr1} reverse={false} />
//       <MarqueeText textArray={textArr2} reverse={true} />
//       <MarqueeText textArray={textArr3} reverse={false} />
//       <MarqueeText textArray={textArr4} reverse={true} />
//     </>
//   );
// };
import React, { useState, useEffect, useRef } from 'react';

const Marquee = ({ textArray, direction }) => {
  const [count, setCount] = useState(0);
  const marqueeRef = useRef(null);

  const initTexts = (element, array) => {
    const text = array.join('\u00A0\u00A0\u00A0\u00A0') + '\u00A0\u00A0\u00A0\u00A0';
    element.current.textContent = text.repeat(2); // 반복되는 텍스트로 설정
  };

  useEffect(() => {
    initTexts(marqueeRef, textArray);

    const animate = () => {
      setCount((prevCount) => {
        if (prevCount > marqueeRef.current.scrollWidth / 2) {
          return 0; // 처음 위치로 리셋
        }
        return prevCount + 1; // 텍스트를 움직이기 위해 카운트 증가
      });
      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    // return () => cancelAnimationFrame(id);
  }, [textArray]);

  useEffect(() => {
    const scrollHandler = () => {
      setCount((prevCount) => prevCount + 15); // 스크롤 시 카운트 증가
    };

    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  return (
    <p
      ref={marqueeRef}
      style={{
        transform: `translate3d(${direction*count}px, 0, 0)`,
        // whiteSpace: 'nowrap',
      }}
    />
  );
};

const MarqueeComponent = () => {
    const textArr1 = 'Yummy Tasty Delicious Useful Coding Yummy Yummmmy Yummmmmmmmmy yum'.split(' ');
    const textArr2 = 'Chicken Hamburger Pizza Salad Sushi Bibimbab Gimbab JJajangmyeon'.split(' ');
    const textArr3 = "Let's Dive Into This Tutorial Take It Easy! Don't Worry".split(' ');
    const textArr4 = 'Pure Moral Conscientious Meritorious Worthy Exemplary Upright '.split(' ');
  
  return (
    <div className={styles.cover}>
      <Marquee textArray={textArr1} direction="1" />
      {/* <Marquee textArray={textArr2} direction="right" />
      <Marquee textArray={textArr3} direction="left" />
      <Marquee textArray={textArr4} direction="right" /> */}
      {/* 추가적인 <Marquee> 컴포넌트를 여기에 배치할 수 있습니다 */}
    </div>
  );
};

export default MarqueeComponent;

