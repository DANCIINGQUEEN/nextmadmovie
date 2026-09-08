"use client";

import Link from "next/link";
import { Play, Search, Settings2 } from "lucide-react";
export default function Header({
  onSearch,
  onSettings
}) {
  return <header className="site-header"><div className="header-inner"><Link href="/" className="brand"><span className="brand-mark"><Play size={15} fill="currentColor" strokeWidth={0} /></span>lolmadmovie<span className="brand-dot">.</span></Link><div className="header-actions"><button className="icon-button" onClick={onSearch} aria-label="영상 검색"><Search size={20} /></button><button className="icon-button" onClick={onSettings} aria-label="설정"><Settings2 size={20} /></button></div></div></header>;
}
