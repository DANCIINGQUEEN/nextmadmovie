"use client";
import getPlaylistByDate from "@/libs/getPlayListByDate";
import EditForm from "./EditForm";
import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

export default function Edit() {
  const [searchDate, setSearchDate] = useState("");
  const [playlist, setPlaylist] = useState(null);
  const [playlistId, setPlaylistId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const errorTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  const mapVideos = (videos) =>
    videos.map(({ title, link }) => ({ title, link }));

  const handleError = (message) => {
    setError(message);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setError(""), 2000);
  };

  const searchPlaylist = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await getPlaylistByDate(searchDate);
      if (!result?.playlist) throw new Error("no playlist");
      setPlaylistId(result.playlist._id);
      const video = mapVideos(result.playlist.video);
      const date = result.playlist.date;
      setPlaylist(JSON.stringify({ date, video }, null, 1));
    } catch {
      handleError("플레이리스트를 찾을 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.editContainer}>
      <h3>리스트 수정</h3>
      <form onSubmit={searchPlaylist} className={styles.searchForm}>
        <input type="text" onChange={(e) => setSearchDate(e.target.value)} />
        <button type="submit">{isLoading ? "검색중..." : "검색"}</button>
      </form>
      {error && <p>{error}</p>}
      {playlist && <EditForm playlist={playlist} id={playlistId} />}
    </div>
  );
}
