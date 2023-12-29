"use client";
import getPlaylistByDate from "@/libs/getPlayListByDate";
import EditForm from "./EditForm";
import { useState } from "react";
import styles from "./page.module.css";
import { apiUrl } from "@/app/api/api";
import { useRouter } from "next/navigation";

export default function Edit() {
  const [searchDate, setSearchDate] = useState("");
  const [playlist, setPlaylist] = useState(null);
  const [playlistId, setPlaylistId] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const mapVideos = (videos) =>
    videos.map(({ title, link }) => ({ title, link }));

  const handleError = (message) => {
    console.error(message);
    setError(message);
    setTimeout(() => setError(""), 2000);
  };

  const searchPlaylist = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const playlist = await getPlaylistByDate(searchDate);
      if (!playlist) throw new Error("no playlist");
      setPlaylistId(playlist.playlist._id);
      const video = mapVideos(playlist.playlist.video);
      const date = playlist.playlist.date;
      const formattedJson = JSON.stringify({ date, video }, null, 1);
      setPlaylist(formattedJson);
    } catch (e) {
      handleError("no playlist");
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
