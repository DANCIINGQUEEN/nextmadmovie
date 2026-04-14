import getPlaylistByDate from "@/libs/getPlayListByDate";
import styles from "./page.module.css";
import Card from "./Card";
import Link from "next/link";
import oldPlayLists from "@/libs/oldplaylists";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { MdHomeFilled } from "react-icons/md";

const dateSplit = (date) => {
  const dateParts = date.split("-");
  return `${dateParts[0]}년 ${dateParts[1]}월 ${dateParts[2]}일`;
};

export async function generateMetadata({ params }) {
  const { date } = await params;
  const title = `${dateSplit(date)}의 영상들`;
  const desc = `${dateSplit(date)}의 하이라이트`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, site_name: "LOL MAD MOVIE" },
    robots: { index: false, follow: true, nocache: true },
  };
}

export default async function DatePage({ params }) {
  const { date } = await params;
  const title = `${dateSplit(date)}의 영상들`;

  const result = await getPlaylistByDate(date);
  const pl = result?.playlist ?? oldPlayLists.find((p) => p.date === date);

  if (!pl) {
    return (
      <div className={styles.videoContainer}>
        <Link href="/" className={styles.goHome}>
          <FaLongArrowAltLeft /> <MdHomeFilled />
        </Link>
        <h4>플레이리스트를 찾을 수 없습니다.</h4>
      </div>
    );
  }

  return (
    <div className={styles.videoContainer}>
      <Link href="/" className={styles.goHome}>
        <FaLongArrowAltLeft /> <MdHomeFilled />
      </Link>
      <h4>{title}</h4>
      {pl.video.map((video, index) => (
        <Card video={video} key={video._id ?? `${date}-${index}`} />
      ))}
    </div>
  );
}
