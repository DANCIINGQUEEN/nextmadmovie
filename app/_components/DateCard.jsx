import VideoPill from "./VideoPill";
export function formatDate(date) {
  if (date === 'old-playlist') return '이전 아카이브 · 날짜 미기록';
  const parts = date.split("-");
  return parts.length === 3 ? `${parts[0].length === 2 ? "20" : ""}${parts[0]}. ${parts[1]}. ${parts[2]}` : date;
}
export default function DateCard({
  playlist,
  onSelect,
  latest
}) {
  return <article className="date-card"><div className="date-card-top"><time dateTime={`${playlist.date.length === 8 ? "20" : ""}${playlist.date}`}>{formatDate(playlist.date)}</time>{latest && <span className="latest-badge">LATEST</span>}<span className="video-count">{playlist.video.length} videos</span></div><div className="video-collection">{playlist.video.map((video, index) => <VideoPill key={`${video.link}-${index}`} video={video} onClick={() => onSelect({
        ...video,
        date: playlist.date
      })} />)}</div></article>;
}
