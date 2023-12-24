import styles from "./components.module.css"
export default function YoutubeLink({ video }) {
  return (
    <li className={styles.list}>
      <p>{video[1].title}</p>
    </li>
  )
}
