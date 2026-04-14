"use client";
import Youtube from "react-youtube";
import { useState, useEffect } from "react";
import styles from "./components.module.css";

export default function YoutubeLink({ link, ratio, isHome }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerWidth, setPlayerWidth] = useState(0);
  const [playerHeight, setPlayerHeight] = useState(0);

  const handlePlayToggle = () => setIsPlaying((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const aspectRatio = 16 / 9;

      let width = windowWidth * ratio;
      let height = width / aspectRatio;

      if (height > windowHeight * 0.7) {
        height = windowHeight * 0.7;
        width = height * aspectRatio;
      }
      setPlayerWidth(Math.floor(width));
      setPlayerHeight(Math.floor(height));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ratio]);

  let videoCode = null;
  try {
    const url = new URL(link.toString());
    videoCode = url.searchParams.get("v");
    if (!videoCode && url.hostname === "youtu.be") {
      videoCode = url.pathname.slice(1);
    }
  } catch {
    videoCode = null;
  }

  if (!videoCode) return null;

  const opts = {
    height: playerHeight,
    width: playerWidth,
    playerVars: { autoplay: 1 },
  };
  const source = `https://img.youtube.com/vi/${videoCode}/maxresdefault.jpg`;

  return (
    <div className={styles.video}>
      {isHome || isPlaying ? (
        <Youtube videoId={videoCode} opts={opts} onEnd={handlePlayToggle} />
      ) : (
        <img
          src={source}
          alt="thumbnail"
          onClick={handlePlayToggle}
          style={{ width: playerWidth }}
        />
      )}
    </div>
  );
}
