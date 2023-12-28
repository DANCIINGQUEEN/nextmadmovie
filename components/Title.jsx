import Link from "next/link";
import styles from "./components.module.css";
export default function Title({ date }) {
  return (
    <div className={styles.badge}>
      <p>{date}</p>
      &nbsp;
      &nbsp;
      <Link href={`/${date}`}>전체보기</Link>
    </div>
  );
}

