"use client"
import { useState, useRef } from "react";
import YoutubeLinks from "./YoutubeLinks";
import styles from "./components.module.css";
import Title from "./Title";

export default function PlayList({ playlist }) {
  
  const date = playlist[1].date;
  const id = playlist[1]._id;

  return (
      <div className={styles.container}>
          <div className={styles.ribbon}>
            <span>{date}</span>
          </div>
          <Title date={date} />
        <YoutubeLinks videos={playlist[1].video} />
      </div>
  );
}
