import styles from './components.module.css'
import Link from 'next/link';

const deco={textDecoration: "none"}
const navBarContent = [
  {link: '/', text: 'LOL', style: {deco, color: "blue"}},
  {link: '/', text: ' ', style: {deco}},
  {link: '/upload', text: 'MAD', style: {deco, color: "skyblue"}},
  {link: '/', text: ' ', style: {deco}},
  {link: '/edit', text: 'MOVIE', style: {deco, color: "red"}},
  // {link: '/upload', text: '', style: {deco, color: "purple"}},
  // {link: '/edit', text: '이', style: {deco, color: "grey"}},
  // {link: '/', text: '라', style: {deco, color: "greenyellow"}},
  // {link: '/', text: '이', style: {deco, color: "orange"}},
  // {link: '/', text: '트', style: {deco, color: "hotpink"}},
]
export default function Navigation() {
  return (
    <h1 className={styles.nav}>
      {navBarContent.map((content, i) => 
          <Link key={i} href={content.link} style={content.style}>
            {content.text}
          </Link>
      )}
    </h1>
  );
}
