import YoutubeLink from "./YoutubeLink";
import styles from "./components.module.css";
import Modal from "./Modal";

export default function YoutubeLinks({ videos, term = "" }) {
  const getButtonColor = (title) => {
    if (term && title.includes(term)) return "yellow";
    if (title.includes("쿼드라")) return "skyblue";
    if (title.includes("펜타")) return "#FF0077FF";
    return "rgba(0,0,0,0.02)";
  };

  return (
    <>
      {videos.map((video, index) => (
        <li className={styles.list} key={video._id ?? `${video.title}-${index}`}>
          <Modal
            multikill={getButtonColor(video.title)}
            button={<>{video.title}</>}
            render={<YoutubeLink link={video.link} ratio={0.9} isHome={true} />}
          />
        </li>
      ))}
    </>
  );
}
