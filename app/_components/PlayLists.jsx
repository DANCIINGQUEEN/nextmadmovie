"use client";
import PlayList from "./PlayList";
import FiltersPlayLists from "./FiltersPlayLists";
import { useState, useEffect } from "react";
import Pagination from "./pagination";
import styles from "./components.module.css";
import oldPlayLists from "@/libs/oldplaylists";
import { usePageNumber } from "@/context/PageNumberContext";
import { useSearchTerm } from "@/context/SearchTermContext";

export default function PlayLists({ playlists }) {
  const playlist = playlists.playlist.concat(oldPlayLists);

  const { currentPage, setCurrentPage, currentFilteredPage, setCurrentFilteredPage } = usePageNumber();
  const { searchTerm, setSearchTerm } = useSearchTerm();

  const [cardsPerPage, setCardsPerPage] = useState(10);

  useEffect(() => {
    const update = () => setCardsPerPage(window.innerWidth < 768 ? 5 : 10);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handlePageNumberClick = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const playlistLength = playlist.length;
  const maxPage = Math.ceil(playlistLength / cardsPerPage);

  const paginatedPlaylist = playlist.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const filteredPlaylists = playlist.filter((pl) =>
    pl.video.some((v) => v.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPlaylistsLength = filteredPlaylists.length;
  const maxFilteredPage = Math.ceil(filteredPlaylistsLength / cardsPerPage);

  const paginatedFiltered = filteredPlaylists.slice(
    (currentFilteredPage - 1) * cardsPerPage,
    currentFilteredPage * cardsPerPage
  );

  const changePage = (page) => {
    if (page >= 1 && page <= maxPage) setCurrentPage(page);
    handlePageNumberClick();
  };

  const changeFilteredPage = (page) => {
    if (page >= 1 && page <= maxFilteredPage) setCurrentFilteredPage(page);
    handlePageNumberClick();
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentFilteredPage(1);
  };

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
          <button onClick={clearSearch}>⨉</button>
        )}
      </div>

      {!searchTerm ? (
        <div className={styles.playlists}>
          {paginatedPlaylist.map((pl) => (
            <PlayList playlist={pl} key={pl.date} />
          ))}
          <Pagination
            currentPage={currentPage}
            maxPage={maxPage}
            onChangePage={changePage}
          />
        </div>
      ) : (
        <div className={styles.playlists}>
          {paginatedFiltered.map((pl) => (
            <FiltersPlayLists playlist={pl} key={pl.date} term={searchTerm} />
          ))}
          <Pagination
            currentPage={currentFilteredPage}
            maxPage={maxFilteredPage}
            onChangePage={changeFilteredPage}
          />
        </div>
      )}
    </>
  );
}
