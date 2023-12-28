// import Head from 'next/head';

// export default function Page({ date }) {
//   return (
//     <>
//       <Head>
//         <title>{date}</title>
//         <meta property="og:title" content={`Date: ${date}`} />
//         {/* 다른 Open Graph 태그도 여기에 추가 */}
//       </Head>
//       <div>
//         <h1>Date: {date}</h1>
//         {/* 페이지 콘텐츠 */}
//       </div>
//     </>
//   );
// }

// export default function Page() {
//     return (
//         <>

//         <div>
//             <h1>Date</h1>
//             {/* 페이지 콘텐츠 */}
//         </div>
//         </>
//     );
//     }

// export async function getServerSideProps(context) {
//   const { params } = context;
//   console.log(params)
//   return {
//     props: {
//       date: params.date // URL에서 date 매개변수 추출
//     },
//   };
// }

import getPlaylistByDate from "@/libs/getPlayListByDate";
import styles from "./page.module.css";
import YoutubeLink from "@/components/YoutubeLink";

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

const DatePage = async ({ params }) => {
  const date = params.date;
  const dateParts = date.split("-");
  const title = `${dateParts[0]}년 ${dateParts[1]}월 ${dateParts[2]}일의 영상들`;

  const playlist = await getPlaylistByDate(date);
  return (
    <div className={styles.videoContainer}>
      <h4>{title}</h4>
      {playlist?.playlist.video.map((pl) => (
        <div className={styles.video} key={pl._id}>
          <p>{pl.title}</p>
          <YoutubeLink link={pl.link} ratio={0.95} isHome={false} />
        </div>
      ))}
    </div>
  );
};

export default DatePage;
