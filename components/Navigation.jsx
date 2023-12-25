import styles from './components.module.css'
import Link from 'next/link';
export default function Navigation() {
  return (
    <h1 className={styles.nav}>
      <span>
        <Link href="/upload" style={{ textDecoration: "none", color: "blue" }}>
          칼
        </Link>
      </span>

      <span>
        <Link href="/" style={{ textDecoration: "none", color: "skyblue" }}>
          바
        </Link>
      </span>

      <span style={{ color: "red" }}>
        <Link href="/rain" style={{ textDecoration: "none", color: "red" }}>
          람
        </Link>
      </span>

      <span>&nbsp;</span>

      <span style={{ color: "purple" }}>
        <Link
          href="/upload"
          style={{ textDecoration: "none", color: "purple" }}
        >
          하
        </Link>
      </span>

      <span style={{ color: "grey" }}>
        <Link href="/home" style={{ textDecoration: "none", color: "grey" }}>
          이
        </Link>
      </span>

      <span style={{ color: "greenyellow" }}>
        <Link
          href="/update"
          style={{ textDecoration: "none", color: "greenyellow" }}
        >
          라
        </Link>
      </span>

      <span style={{ color: "orange" }}>이</span>

      <span style={{ color: "hotpink" }}>트</span>
    </h1>
  );
}
