"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { apiUrl } from "@/app/api/api";
import { useRouter } from "next/navigation";
import updatePlaylist from "@/libs/updatePlayListById";
import deletePlaylist from "@/libs/deletePlayListById";

export default function EditForm({ playlist, id }) {

  const [editedPlaylist, setEditedPlaylist] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const router = useRouter();

  const handleEditPlaylist = async (e) => {
    setIsEditLoading(true);
    e.preventDefault();
    try {
      await updatePlaylist(id, editedPlaylist);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("error", e);
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleDeletePlaylist = async (e) => {
    setIsDeleteLoading(true);
    e.preventDefault();
    try {
      await deletePlaylist(id);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("error", e);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className={styles.editForm}>
      <textarea
        defaultValue={playlist}
        onChange={(e) => setEditedPlaylist(e.target.value)}/>
      <div>
        <button onClick={handleEditPlaylist}>
          {isEditLoading ? "수정중..." : "수정"}
        </button>
        <button onClick={handleDeletePlaylist}>
          {isDeleteLoading ? "삭제중..." : "삭제"}
        </button>
      </div>
    </div>
  );
}
