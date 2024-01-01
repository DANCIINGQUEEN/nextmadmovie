import getPlaylistByDate from "@/libs/getPlayListByDate";
import styles from "./page.module.css";
import Card from "./Card";
import Link from "next/link";
import oldPlayLists4 from "@/libs/oldplaylists4";
import oldPlayLists3 from "@/libs/oldplaylists3";
import oldPlayLists2 from "@/libs/oldplaylists2";
import oldPlayLists1 from "@/libs/oldplaylists1";
import { v4 } from "uuid";

const dateSplit=(date)=>{
  const dateParts = date.split("-");
  return `${dateParts[0]}년 ${dateParts[1]}월 ${dateParts[2]}일`
}

export async function generateMetadata({ params: { date } }) {
  const title=`${dateSplit(date)}의 영상들`
  const desc=`${dateSplit(date)}의 하이라이트`
  return {
    title: title,
    description: desc,
    openGraph: {
      title: title,
      description: desc,
      site_name: "LOL MAD MOVIE",
    },
    robots: {
      index: false,
      follow: true,
      nocache: true,
    },
  };
}

export default async function DatePage({ params }) {
  const oldPlayList = oldPlayLists4.concat(
    oldPlayLists3,
    oldPlayLists2,
    oldPlayLists1
  );
  const date = params.date;
  const title=`${dateSplit(date)}의 영상들`

  const playlist = await getPlaylistByDate(date);
  let pl = playlist.playlist;
  if(!pl) pl= oldPlayList.find((pl) => pl.date === date);

  return (
    <div className={styles.videoContainer}>
      <Link href={"/"} className={styles.goHome}>
        ← home
      </Link>
      <h4>{title}</h4>
      {pl.video.map((pl) => (
        <Card video={pl} key={v4()} />
      ))}
    </div>
  );
}
