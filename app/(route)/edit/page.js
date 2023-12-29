"use client";
import getPlaylistByDate from "@/libs/getPlayListByDate";
import { useState } from "react";
import styles from "./page.module.css";
import { apiUrl } from "@/app/api/api";
import { useRouter } from "next/navigation";

export default function Edit() {
  const [searchDate, setSearchDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [playlistId, setPlaylistId] = useState("");
  const [editedPlaylist, setEditedPlaylist] = useState(null);
  const [error, setError] = useState("");

  const router = useRouter();

  const searchPlaylist = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const playlist = await getPlaylistByDate(searchDate);
      if (!playlist) {
        throw new Error("no playlist");
      }
      setPlaylistId(playlist.playlist._id);
      let video = playlist.playlist.video;
      video = video.map((video) => ({
        title: video.title,
        link: video.link,
      }));
      const date = playlist.playlist.date;
      const formattedJson = JSON.stringify({ date, video }, null, 1);
      setPlaylist(formattedJson);
    } catch (e) {
      console.error(e);
      setError("no playlist");
      setTimeout(() => {
        setError("");
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    setIsEditLoading(true);
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/${playlistId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: editedPlaylist,
      });
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("error", e);
    }finally{
      setIsEditLoading(false)
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
      <form onSubmit={handleSubmit} className={styles.editForm}>
        {playlist && (
          <>
            <textarea
              defaultValue={playlist}
              onChange={(e) => setEditedPlaylist(e.target.value)}
            />
            <button type="submit">{isEditLoading?'수정중...':'수정'}</button>
          </>
        )}
      </form>
    </div>
  );
}
