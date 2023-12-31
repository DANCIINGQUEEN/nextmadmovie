"use client";
import PlayList from "./PlayList";
import FiltersPlayLists from "./FiltersPlayLists";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Pagination from "./pagination";
import styles from "./components.module.css";

export default function PlayLists({ playlists }) {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
  const [filteredCurrentPage, setFilteredCurrentPage] = useState(1); // 필터 페이지 상태 관리
  const [searchTerm, setSearchTerm] = useState("");

  const handlePageNumberClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

  const CARD_PER_PAGE = 5; // 페이지당 표시할 항목 수
  const playlistLength = playlists?.playlist?.length;
  const maxPage = Math.ceil(playlistLength / CARD_PER_PAGE);

  const paginatedPlaylist = playlists?.playlist?.slice(
    (currentPage - 1) * CARD_PER_PAGE,
    (currentPage - 1) * CARD_PER_PAGE + CARD_PER_PAGE
  );

  let filteredPlaylists = playlists?.playlist?.filter((pl) =>
    pl.video.some((v) =>
      v.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredPlaylistsLength = filteredPlaylists?.length;

  filteredPlaylists = filteredPlaylists?.slice(
    (filteredCurrentPage - 1) * CARD_PER_PAGE,
    (filteredCurrentPage - 1) * CARD_PER_PAGE + CARD_PER_PAGE
  );
  const maxfilterdPage = Math.ceil(filteredPlaylistsLength / CARD_PER_PAGE);

  const changePage = (page) => {
    if (page >= 1 && page <= maxPage) setCurrentPage(page);
    handlePageNumberClick();
  };
  const changeFilteredPage = (page) => {
    if (page >= 1 && page <= maxfilterdPage) setFilteredCurrentPage(page);
  };

  
  return (
    <div>
      <input
        type="text"
        className={styles.search}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어"
      />

      {!searchTerm ? (
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
      ) : (
        <>
          {filteredPlaylists.map((playlist) => (
            <FiltersPlayLists
              playlist={playlist}
              key={playlist._id}
              term={searchTerm}
            />
          ))}
          <Pagination
            currentPage={filteredCurrentPage}
            maxPage={maxfilterdPage}
            onChangePage={changeFilteredPage}
          />
        </>
      )}
    </div>
  );
}
