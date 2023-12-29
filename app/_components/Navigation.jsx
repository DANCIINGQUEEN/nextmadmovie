import styles from './components.module.css'
import Link from 'next/link';

const deco={textDecoration: "none"}
const navBarContent = [
  {link: '/', text: '칼', style: {deco, color: "blue"}},
  {link: '/', text: '바', style: {deco, color: "skyblue"}},
  {link: '/rain', text: '람', style: {deco, color: "red"}},
  {link: '/', text: ' ', style: {deco}},
  {link: '/upload', text: '하', style: {deco, color: "purple"}},
  {link: '/edit', text: '이', style: {deco, color: "grey"}},
  {link: '/', text: '라', style: {deco, color: "greenyellow"}},
  {link: '/', text: '이', style: {deco, color: "orange"}},
  {link: '/', text: '트', style: {deco, color: "hotpink"}},
]
export default function Navigation() {
  return (
    <h1 className={styles.nav}>
      {navBarContent.map((content, i) => 
        <span key={i}>
          <Link href={content.link} style={content.style}>
            {content.text}
          </Link>
        </span>
      )}
    </h1>
  );
}
