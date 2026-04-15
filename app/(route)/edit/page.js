"use client";
import getPlaylistByDate from "@/libs/getPlayListByDate";
import EditForm from "./EditForm";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Edit() {
  const [searchDate, setSearchDate] = useState("");
  const [playlist, setPlaylist] = useState(null);
  const [playlistId, setPlaylistId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const errorTimerRef = useRef(null);

  useEffect(() => {
    return () => { if (errorTimerRef.current) clearTimeout(errorTimerRef.current); };
  }, []);

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
      const video = result.playlist.video.map(({ title, link }) => ({ title, link }));
      setPlaylist(JSON.stringify({ date: result.playlist.date, video }, null, 1));
    } catch {
      handleError("플레이리스트를 찾을 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-xl font-semibold text-[var(--color-gold)]">리스트 수정</h1>

      <form onSubmit={searchPlaylist} className="mb-6 flex gap-2">
        <Input
          type="text"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          placeholder="날짜 입력 (예: 24-01-01)"
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading} variant="secondary" className="gap-1.5">
          <Search className="h-3.5 w-3.5" />
          {isLoading ? "검색중..." : "검색"}
        </Button>
      </form>

      {error && <p className="mb-4 text-sm text-[var(--color-penta)]">{error}</p>}
      {playlist && <EditForm playlist={playlist} id={playlistId} />}
    </div>
  );
}
