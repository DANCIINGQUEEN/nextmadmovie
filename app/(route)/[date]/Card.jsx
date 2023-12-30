import YoutubeLink from '@/app/_components/YoutubeLink'
import styles from './page.module.css'
export default function Card({ video }) {
    
    return(
        <div className={styles.video}>
            <p>{video.title}</p>
            <YoutubeLink link={video.link} ratio={0.95} isHome={false}/>
        </div>
    )
}