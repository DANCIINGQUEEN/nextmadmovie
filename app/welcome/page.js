import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
export default function Welcome() {
  return <main className="welcome-page"><div className="welcome-content"><div className="welcome-logo"><Play size={36} fill="currentColor" strokeWidth={0} /></div><div className="eyebrow">THE PLAY, REPLAYED.</div><h1>lolmadmovie<span>.</span></h1><p>다시 보고 싶은 순간들.<br />우리의 협곡, 잊지 못할 플레이를 모으다.</p><Link className="start-button" href="/">시작하기 <ArrowRight size={17} /></Link></div><span className="welcome-footer">LEAGUE OF LEGENDS HIGHLIGHT ARCHIVE</span></main>;
}
