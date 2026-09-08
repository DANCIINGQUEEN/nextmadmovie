"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Play, Search, X } from "lucide-react";
import Link from "next/link";
import Header from "./Header";
import DateCard from "./DateCard";
import Pagination from "./ArchivePagination";
import VideoModal, { CenteredDialog } from "./VideoModal";
export default function Archive({
  playlists,
  offline
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("전체");
  const [page, setPage] = useState(1);
  const [video, setVideo] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [size, setSize] = useState(5);
  const input = useRef(null);
  const lastFocus = useRef(null);
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("lolmadmovie-page-size"));
      if ([5, 10, 20].includes(saved)) setSize(saved);
    } catch {}
  }, []);
  useEffect(() => {
    if (searchOpen) input.current?.focus();
  }, [searchOpen]);
  const filtered = useMemo(() => playlists.map(group => ({
    ...group,
    video: group.video.filter(item => item.title.toLowerCase().includes(query.trim().toLowerCase()) && (filter === "전체" || item.title.includes(filter)))
  })).filter(group => group.video.length), [playlists, query, filter]);
  const total = Math.ceil(filtered.length / size);
  const count = filtered.reduce((sum, group) => sum + group.video.length, 0);
  function closeModal() {
    setVideo(null);
    setSettingsOpen(false);
    requestAnimationFrame(() => lastFocus.current?.focus());
  }
  function selectVideo(item) {
    lastFocus.current = document.activeElement;
    setVideo(item);
  }
  return <div className="archive-shell"><Header onSearch={() => setSearchOpen(value => !value)} onSettings={() => {
      lastFocus.current = document.activeElement;
      setSettingsOpen(true);
    }} /><main className="archive-main"><section className="archive-intro"><div className="eyebrow"><span /> THE PLAY, REPLAYED.</div><h1>다시 보고 싶은 <span>순간들.</span></h1><p>우리의 협곡, 잊지 못할 플레이.<br className="mobile-break" /> 그 순간을 여기에 모았어요.</p><div className="intro-note"><Play size={12} fill="currentColor" /> LEAGUE OF LEGENDS ARCHIVE</div></section><section className="archive-content" aria-label="날짜별 영상 아카이브"><div className="list-toolbar"><div className="filter-tabs" aria-label="영상 종류">{["전체", "펜타", "쿼드라"].map(item => <button aria-pressed={filter === item} className={filter === item ? "selected" : ""} key={item} onClick={() => {
              setFilter(item);
              setPage(1);
            }}>{item !== "전체" && <span className={`filter-dot ${item === "펜타" ? "pink" : "blue"}`} />}{item === "전체" ? "모든 순간" : `${item}킬`}</button>)}</div><span className="archive-total">{count.toLocaleString()} videos</span></div>{searchOpen && <div className="search-field"><Search size={18} /><input ref={input} value={query} onChange={event => {
            setQuery(event.target.value);
            setPage(1);
          }} placeholder="챔피언, 영상 제목 검색" aria-label="영상 제목 검색" /><button className="icon-button" onClick={() => {
            setQuery("");
            setPage(1);
            setSearchOpen(false);
          }} aria-label="검색 닫기"><X size={17} /></button></div>}{offline && <p className="archive-notice">현재 저장된 아카이브를 보고 있어요. 최신 영상은 연결 복구 후 표시됩니다.</p>}<div className="date-list">{filtered.slice((page - 1) * size, page * size).map((group, index) => <DateCard key={group.date} playlist={group} latest={page === 1 && index === 0 && !query && filter === "전체"} onSelect={selectVideo} />)}</div>{!filtered.length && <div className="empty-state"><Search size={28} /><h2>아직 찾는 순간이 없어요.</h2><p>다른 챔피언이나 영상 제목으로 검색해 보세요.</p><button onClick={() => {
            setQuery("");
            setFilter("전체");
            setPage(1);
          }}>모든 순간 보기</button></div>}<Pagination page={page} total={total} onChange={number => {
          setPage(number);
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        }} /></section><footer className="site-footer"><span>작은 플레이도, 오래 기억되도록.</span><Link href="/welcome">lolmadmovie <ArrowUpRight size={13} /></Link></footer></main><VideoModal video={video} onClose={closeModal} /><CenteredDialog open={settingsOpen} onClose={closeModal} title="아카이브 설정" className="settings-modal"><label className="setting-row" htmlFor="page-size">페이지당 날짜 수<select id="page-size" value={size} onChange={event => {
          const value = Number(event.target.value);
          setSize(value);
          setPage(1);
          try {
            localStorage.setItem("lolmadmovie-page-size", String(value));
          } catch {}
        }}>{[5, 10, 20].map(value => <option key={value} value={value}>{value}개</option>)}</select></label><Link className="settings-link" href="/welcome">시작 화면 보기 <ArrowUpRight size={16} /></Link><Link className="settings-link" href="/upload">영상 등록 <ArrowUpRight size={16} /></Link></CenteredDialog></div>;
}
