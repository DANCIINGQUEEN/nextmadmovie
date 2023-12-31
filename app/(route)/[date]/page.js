import getPlaylistByDate from "@/libs/getPlayListByDate";
import styles from "./page.module.css";
import Card from "./Card";
import Link from "next/link";

export async function generateMetadata({ params: { date } }) {
  const dateParts = date.split("-");
  const title = `${dateParts[0]}년 ${dateParts[1]}월 ${dateParts[2]}일의 영상들`;
  const desc = `${dateParts[0]}년 ${dateParts[1]}월 ${dateParts[2]}일의 하이라이트`;
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

export default async function DatePage ({ params }){
  const date = params.date;
  const dateParts = date.split("-");
  const title = `${dateParts[0]}년 ${dateParts[1]}월 ${dateParts[2]}일의 영상들`;

  const playlist = await getPlaylistByDate(date);
  return (
    <div className={styles.videoContainer}>
      <Link href={'/'} className={styles.goHome}>← home</Link>
      <h4>{title}</h4>
      {playlist?.playlist?.video.map((pl) => <Card video={pl} key={pl._id} />)}
    </div>
  );
};


