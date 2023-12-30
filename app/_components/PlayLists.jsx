"use client";
import PlayList from "./PlayList";
import Loading from "./Loading";
import { apiUrl } from "../api/api";
import styles from "./components.module.css";
import { useState } from "react";
import Pagination from "./pagination";

export default function PlayLists({playlists}) {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리

  const CARD_PER_PAGE = 5; // 페이지당 표시할 항목 수
  const playlistLength = playlists?.playlist?.length;
  const maxPage = Math.ceil(playlistLength / CARD_PER_PAGE);

  const paginatedPlaylist = playlists?.playlist?.slice(
    (currentPage - 1) * CARD_PER_PAGE,
    (currentPage - 1) * CARD_PER_PAGE + CARD_PER_PAGE
  );

  const changePage = (page) => {
    if (page >= 1 && page <= maxPage) setCurrentPage(page);
  };

  return (
    <div>
      {paginatedPlaylist && (
        <>
          {Object.entries(paginatedPlaylist).map((playlist) => (
            <PlayList playlist={playlist} key={playlist[1]._id} />
          ))}
           <Pagination
            currentPage={currentPage}
            maxPage={maxPage}
            onChangePage={changePage}
          />
        </>
      )}
    </div>
  );
}
