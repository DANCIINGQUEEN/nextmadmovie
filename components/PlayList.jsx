import Link from "next/link"
import YoutubeLinks from "./YoutubeLinks"
import styles from "./components.module.css"
import Title from "./Title"
export default function PlayList({playlist}) {
    const date=playlist[1].date
    const id=playlist[1]._id
    return(
        <div className={styles.container}>
           <Title date={date} id={id}/>
            
            <YoutubeLinks videos={playlist[1].video}/>
        </div>
    )
}