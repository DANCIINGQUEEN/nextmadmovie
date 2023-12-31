import Title from './Title'
import YoutubeLinks from './YoutubeLinks'
import styles from './components.module.css'
export default function FiltersPlayLists({playlist, term}) {
    // console.log(playlist)
    const date=playlist.date
    return(
        <div className={styles.container}>
            <div className={styles.ribbon}>
                <span>{date}</span>
            </div>
            <Title date={date}/> 
            <YoutubeLinks videos={playlist.video} term={term}/>
        </div>
    )
}