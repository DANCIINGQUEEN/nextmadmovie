"use client";
import getPlaylistByDate from "@/libs/getPlayListByDate";
import { useState } from "react";
import styles from "./page.module.css";
import { apiUrl } from "@/app/api/api";
import { useRouter } from "next/navigation";

export default function Edit() {
  const [searchDate, setSearchDate] = useState("");
  const [playlist, setPlaylist] = useState(null);
  const [playlistId, setPlaylistId] = useState("");
  const [editedPlaylist, setEditedPlaylist] = useState(null);
  const [error, setError] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const router = useRouter();

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
      if (!playlist) {
        throw new Error("no playlist");
      }
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

  const handleSubmit = async (e) => {
    setIsEditLoading(true);
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/${playlistId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: editedPlaylist,
      });
      if (!res.ok) throw new Error("An error occurred");
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("error", e);
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleDeletePlaylist = async (e) => {
    setIsDeleteLoading(true)
    e.preventDefault()
    try{
      const res=await fetch(`${apiUrl}/${playlistId}`,{
        method:"DELETE"
      })
      if(!res.ok) throw new Error("An error occurred")
      router.push('/')
      router.refresh()
      }catch(e){
        console.error("error",e)
    }finally{
      setIsDeleteLoading(false)
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
            <div>
              <button type="submit">
                {isEditLoading ? "수정중..." : "수정"}
              </button>
              <button onClick={handleDeletePlaylist}>{isDeleteLoading ? "삭제중..." : "삭제"}</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
