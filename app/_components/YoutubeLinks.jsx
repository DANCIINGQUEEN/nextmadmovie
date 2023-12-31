import YoutubeLink from "./YoutubeLink";
import styles from "./components.module.css";
import Modal from "./Modal";

export default function YoutubeLinks({ videos, term }) {
  const multiKill = (title) => {
    if (title.includes("쿼드라")) return "skyblue";
    else if (title.includes("펜타")) return "#FF0077FF";
    else return "rgba(0,0,0,0.02)";
  };

  const filteredAndMultiKill = (title) => {
    if (title.includes(term)) return "yellow";
    if (term === '') return "rgba(0,0,0,0.02)";
    return multiKill(title);
  };

  return (
    <>
      {Object.entries(videos).map((video) => (
        <li className={styles.list} key={video[1]._id}>
          <Modal
            multikill={filteredAndMultiKill(video[1].title)}
            filtered={filteredAndMultiKill(video[1].title)}
            button={<>{video[1].title}</>}
            render={<YoutubeLink link={video[1].link} ratio={0.9} isHome={true}/>}
          ></Modal>
        </li>
      ))}
    </>
  );
}
