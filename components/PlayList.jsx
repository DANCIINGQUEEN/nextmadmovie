"use client"
import { useState, useRef } from "react";
import YoutubeLinks from "./YoutubeLinks";
import styles from "./components.module.css";
import Title from "./Title";

export default function PlayList({ playlist }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { top, left, width, height } =
      cardRef.current.getBoundingClientRect();
    const horizontal = (clientX - left) / width;
    const vertical = (clientY - top) / height;
    const rotateX = (vertical - 0.5) * -15; // degrees
    const rotateY = (horizontal - 0.5) * 15; // degrees
    setRotate({ x: rotateX, y: rotateY });
  };

  const resetCardStyle = () => {
    setRotate({ x: 0, y: 0 });
  };
  const date = playlist[1].date;
  const id = playlist[1]._id;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={resetCardStyle}
      ref={cardRef}
    >
      <div
        style={{
          transform: `rotateY(${rotate.y}deg) rotateX(${rotate.x}deg)`,
          transition: "transform 0.2s",
          transformStyle: "preserve-3d",
        }}
        className={styles.container}
      >
        <Title date={date} id={id} />
        <YoutubeLinks videos={playlist[1].video} />
      </div>
    </div>
  );
}
