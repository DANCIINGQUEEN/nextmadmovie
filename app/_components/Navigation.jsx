import styles from './components.module.css'
import Link from 'next/link';

const navItems = [
  { link: '/',       text: 'LOL',   color: "skyblue" },
  { link: '/',       text: ' ',     color: "skyblue" },
  { link: '/upload', text: 'MAD',   color: "skyblue" },
  { link: '/',       text: ' ',     color: "skyblue" },
  { link: '/edit',   text: 'MOVIE', color: "skyblue" },
];

export default function Navigation() {
  return (
    <h1 className={styles.nav}>
      {navItems.map((item, i) => (
        <Link
          key={i}
          href={item.link}
          style={{ textDecoration: "none", color: item.color }}
        >
          {item.text}
        </Link>
      ))}
    </h1>
  );
}
