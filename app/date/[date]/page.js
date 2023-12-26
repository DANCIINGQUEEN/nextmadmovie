import { apiUrl } from "@/app/api/api";
import YoutubeLink from "@/components/YoutubeLink";
import styles from "./page.module.css";
export async function generateMetaData({ params, searchParams }, parent) {
  // read route params
  const date = params.date;

  // split date into parts
  const dateParts = date.split("-");
  const description = `${dateParts[0]}년 ${dateParts[1]}월 ${dateParts[2]}일의 영상들`;

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || [];

  return {
    title: "칼바람 하이라이트",
    openGraph: {
      title: "칼바람 하이라이트",
      description: description,
      // images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  };
}

const getPlaylistByDate = async (date) => {
  try {
    const res = await fetch(`${apiUrl}/playlist/${date}`);
    if (!res.ok) {
      throw new Error("An error occurred");
    }
    return res.json();
  } catch (e) {
    console.error(e);
  }
};

export default async function Date({ params }) {
  const { date } = params;
  const dateParts = date.split`-`;
  const title = `${dateParts[0]}년 ${dateParts[1]}월 ${dateParts[2]}일의 영상들`;

  const { playlist } = await getPlaylistByDate(date);

  return (
    <div className={styles.videoContainer}>
      <h4>{title}</h4>
      {playlist?.video.map((pl) => (
        <div className={styles.video} key={pl._id}>
          <p>{pl.title}</p>
          <YoutubeLink
            link={pl.link}
            ratio={0.95}
            isHome={false}
          />
        </div>
      ))}
    </div>
  );
}
