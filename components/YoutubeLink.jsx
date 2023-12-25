"use client";
import Youtube from "react-youtube";
import { useState, useEffect } from "react";
import styles from "./components.module.css";

export default function YoutubeLink({ link, ratio, isHome }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerWidth, setPlayerWidth] = useState(0);
  const [playerHeight, setPlayerHeight] = useState(0);


  // 재생 상태 변경 핸들러
  const handlePlayToggle = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const aspectRatio = 16 / 9; // 가로 세로 비율 (16:9)

      // 브라우저 창의 너비에 따라 비율 계산
      let width = windowWidth * ratio;
      let height = width / aspectRatio;

      // 너비가 화면에 맞지 않을 경우, 높이 기준으로 비율 계산
      if (height > windowHeight * 0.7) {
        height = windowHeight * 0.7;
        width = height * aspectRatio;
      }

      setPlayerWidth(Math.floor(width));
      setPlayerHeight(Math.floor(height));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const opts = {
    height: playerHeight,
    width: playerWidth,
    playerVars: {
        autoplay: 1,
    },
};

const videoCode=link.toString().split('watch?v=')[1]
const source=`https://img.youtube.com/vi/${videoCode}/maxresdefault.jpg`

const videoComponent=<Youtube videoId={videoCode} opts={opts} onEnd={handlePlayToggle}/>
const thumbnailComponent=<img src={source} alt="thumbnail" className={styles.thumbnail} onClick={handlePlayToggle} style={{width: playerWidth, borderRadius: '20px'}}/>
  return (
    <div className={styles.video}>
            {isHome ?
                videoComponent
                :
                (isPlaying ? videoComponent : thumbnailComponent)
            }
        </div>
  );
}
