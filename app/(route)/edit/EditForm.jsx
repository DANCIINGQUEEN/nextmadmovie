"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePlaylistAction, deletePlaylistAction } from "./actions";

export default function EditForm({ playlist, id }) {
  const [editedPlaylist, setEditedPlaylist] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleEditPlaylist = async () => {
    setIsEditLoading(true);
    try {
      const result = await updatePlaylistAction(id, editedPlaylist ?? playlist);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("수정 중 오류가 발생했습니다.");
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!confirm("정말 지울건가?")) return;
    setIsDeleteLoading(true);
    try {
      const result = await deletePlaylistAction(id);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className={styles.editForm}>
      {error && <p>{error}</p>}
      <textarea
        defaultValue={playlist}
        onChange={(e) => setEditedPlaylist(e.target.value)}
      />
      <div>
        <button onClick={handleEditPlaylist} disabled={isEditLoading || isDeleteLoading}>
          {isEditLoading ? "수정중..." : "수정"}
        </button>
        <button onClick={handleDeletePlaylist} disabled={isEditLoading || isDeleteLoading}>
          {isDeleteLoading ? "삭제중..." : "삭제"}
        </button>
      </div>
    </div>
  );
}
