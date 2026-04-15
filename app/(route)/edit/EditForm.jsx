"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePlaylistAction, deletePlaylistAction } from "./actions";
import { Button } from "@/components/ui/button";

export default function EditForm({ playlist, id }) {
  const [editedPlaylist, setEditedPlaylist] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const busy = isEditLoading || isDeleteLoading;

  const handleEditPlaylist = async () => {
    setIsEditLoading(true);
    try {
      const result = await updatePlaylistAction(id, editedPlaylist ?? playlist);
      if (result.error) setError(result.error);
      else { router.push("/"); router.refresh(); }
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
      if (result.error) setError(result.error);
      else { router.push("/"); router.refresh(); }
    } catch {
      setError("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-[var(--color-penta)]">{error}</p>}
      <textarea
        defaultValue={playlist}
        onChange={(e) => setEditedPlaylist(e.target.value)}
        rows={12}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 font-mono text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)] resize-y"
      />
      <div className="flex gap-2">
        <Button onClick={handleEditPlaylist} disabled={busy}>
          {isEditLoading ? "수정중..." : "수정"}
        </Button>
        <Button variant="destructive" onClick={handleDeletePlaylist} disabled={busy}>
          {isDeleteLoading ? "삭제중..." : "삭제"}
        </Button>
      </div>
    </div>
  );
}
