"use client";
import PlayList from "./PlayList";
import Loading from "./Loading";
import { apiUrl } from "../api/api";
import styles from "./components.module.css";
import { useState, useEffect } from "react";

export default function PlayLists() {
  const [playlists, setPlaylists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  const playlistLength = playlists?.playlist?.length;
  const maxPage = Math.ceil(playlistLength / 5);
  const itemsPerPage = 5; // 페이지당 표시할 항목 수
  const paginatedPlaylist = playlists?.playlist?.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage
  );

  useEffect(() => {
    setLoading(true);
    const fetchPlaylists = async () => {
      try {
        const res = await fetch(`${apiUrl}/playlist`);
        const data = await res.json();
        setPlaylists(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const pagesToShow = () => {
    const pages = [];
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i > 0 && i <= maxPage) pages.push(i);
    }
    return pages;
  };
  const changePage = (page) => {
    if (page >= 1 && page <= maxPage) setCurrentPage(page);
  };

  return (
    <div>
      <div className={styles.load}>{loading && <Loading />}</div>
      {paginatedPlaylist && (
        <>
          {Object.entries(paginatedPlaylist).map((playlist) => (
            <PlayList playlist={playlist} key={playlist[1]._id} />
          ))}
          <div className={styles.pageContainer}>
            <button className={styles.pageButton} onClick={() => changePage(1)}>
              &laquo;
            </button>
            {currentPage > 1 && (
              <button
                className={styles.pageButton}
                onClick={() => changePage(currentPage - 1)}
              >
                &lsaquo;
              </button>
            )}
            {pagesToShow().map((page) => (
              <button
                className={
                  currentPage == page
                    ? styles.activePaginationButton
                    : styles.paginationButton
                }
                key={page}
                onClick={() => changePage(page)}
              >
                {page}
              </button>
            ))}
            {currentPage < maxPage && (
              <button
                className={styles.pageButton}
                onClick={() => changePage(currentPage + 1)}
              >
                &rsaquo;
              </button>
            )}
            <button
              className={styles.pageButton}
              onClick={() => changePage(maxPage)}
            >
              &raquo;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
