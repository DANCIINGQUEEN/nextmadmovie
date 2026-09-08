export default function VideoPill({
  video,
  onClick
}) {
  const tone = video.title.includes("펜타") ? "penta" : video.title.includes("쿼드라") ? "quadra" : "neutral";
  return <button className={`video-pill ${tone}`} title={video.title} onClick={onClick}><span>{video.title}</span></button>;
}
