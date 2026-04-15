"use client";
import PlayList from "./PlayList";
import FiltersPlayLists from "./FiltersPlayLists";
import { useState, useEffect } from "react";
import Pagination from "./pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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

  const handlePageNumberClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const maxPage = Math.ceil(playlist.length / cardsPerPage);
  const paginatedPlaylist = playlist.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const filteredPlaylists = playlist.filter((pl) =>
    pl.video.some((v) => v.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const maxFilteredPage = Math.ceil(filteredPlaylists.length / cardsPerPage);
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

  const activeList = searchTerm ? paginatedFiltered : paginatedPlaylist;
  const activeMax  = searchTerm ? maxFilteredPage  : maxPage;
  const activePage = searchTerm ? currentFilteredPage : currentPage;
  const onChangePage = searchTerm ? changeFilteredPage : changePage;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Search bar */}
      <div className="mb-6 flex items-center gap-2 max-w-xs">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="챔피언, 킬 검색..."
            className="pr-8"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {searchTerm && (
          <span className="text-xs text-[var(--color-text-muted)]">
            {filteredPlaylists.length}건
          </span>
        )}
      </div>

      {/* Playlist grid */}
      <div className="flex flex-col items-center gap-4">
        {searchTerm
          ? paginatedFiltered.map((pl) => (
              <FiltersPlayLists playlist={pl} key={pl.date} term={searchTerm} />
            ))
          : paginatedPlaylist.map((pl) => (
              <PlayList playlist={pl} key={pl.date} />
            ))}
      </div>

      <Pagination
        currentPage={activePage}
        maxPage={activeMax}
        onChangePage={onChangePage}
      />
    </div>
  );
}
