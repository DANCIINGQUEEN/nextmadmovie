"use client"
import YoutubeLinks from "./YoutubeLinks";
import styles from "./components.module.css";
import Title from "./Title";

export default function PlayList({ playlist }) {
  const { date, video } = playlist;

  return (
    <div className={styles.container}>
      <div className={styles.ribbon}>
        <span>{date}</span>
      </div>
      <Title date={date} />
      <YoutubeLinks videos={video} />
    </div>
  );
}
