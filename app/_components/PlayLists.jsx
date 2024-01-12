"use client";
import PlayList from "./PlayList";
import FiltersPlayLists from "./FiltersPlayLists";
import { useState } from "react";
import Pagination from "./pagination";
import styles from "./components.module.css";
import { v4 } from "uuid";
import oldPlayLists from "@/libs/oldplaylists";
import { usePageNumber } from "@/context/PageNumberContext";
import { useSearchTerm } from "@/context/SearchTermContext";

export default function PlayLists({ playlists }) {
  const playlist = playlists.playlist.concat(oldPlayLists);

  const { currentPage, setCurrentPage } = usePageNumber();

  const { currentFilteredPage, setCurrentFilteredPage } = usePageNumber();

  const { searchTerm, setSearchTerm } = useSearchTerm();

  const handlePageNumberClick = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const CARD_PER_PAGE = window.innerWidth < 768 ? 5 : 10;
  
  const playlistLength = playlist?.length;
  const maxPage = Math.ceil(playlistLength / CARD_PER_PAGE);

  let paginatedPlaylist = playlist?.slice(
    (currentPage - 1) * CARD_PER_PAGE,
    (currentPage - 1) * CARD_PER_PAGE + CARD_PER_PAGE
  );
  paginatedPlaylist = Object.entries(paginatedPlaylist);

  let filteredPlaylists = playlist?.filter((pl) =>
    pl.video.some((v) =>
      v.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredPlaylistsLength = filteredPlaylists?.length;

  filteredPlaylists = filteredPlaylists?.slice(
    (currentFilteredPage - 1) * CARD_PER_PAGE,
    (currentFilteredPage - 1) * CARD_PER_PAGE + CARD_PER_PAGE
  );
  const maxfilterdPage = Math.ceil(filteredPlaylistsLength / CARD_PER_PAGE);

  const changePage = (page) => {
    if (page >= 1 && page <= maxPage) setCurrentPage(page);
    handlePageNumberClick();
  };
  const changeFilteredPage = (page) => {
    if (page >= 1 && page <= maxfilterdPage) setCurrentFilteredPage(page);
    handlePageNumberClick();
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentFilteredPage(1);
  }

  return (
    <>
      <div className={styles.search}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색어"
        />
        {searchTerm && (
          <button onClick={clearSearch}>
            ⨉
          </button>
        )}
      </div>

      {!searchTerm ? (
        <div className={styles.playlists}>
          {paginatedPlaylist.map((playlist) => (
            <PlayList playlist={playlist} key={v4()} />
          ))}
          <Pagination
            currentPage={currentPage}
            maxPage={maxPage}
            onChangePage={changePage}
          />
        </div>
      ) : (
        <div className={styles.playlists}>
          {filteredPlaylists.map((playlist) => (
            <FiltersPlayLists
              playlist={playlist}
              key={v4()}
              term={searchTerm}
            />
          ))}
          <Pagination
            currentPage={currentFilteredPage}
            maxPage={maxfilterdPage}
            onChangePage={changeFilteredPage}
          />
        </div>
      )}
    </>
  );
}
