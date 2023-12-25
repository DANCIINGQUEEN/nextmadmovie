import styles from "./components.module.css";
import Modal from "./Modal";
export default function YoutubeLink({ video }) {
  const multiKill = (title) => {
    if (title.includes("쿼드라")) return "skyblue";
    else if (title.includes("펜타")) return "#FF0077FF";
    else return "rgba(0,0,0,0.02)";
  };
  const title = video[1].title;

  return (
    <li className={styles.list}>
      <Modal
        multikill={multiKill(title)}
        button={<>{title}</>}
        render={<>hello</>}
      ></Modal>
    </li>
  );
}
