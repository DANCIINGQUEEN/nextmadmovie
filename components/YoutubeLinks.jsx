import YoutubeLink from "./YoutubeLink";
export default function YoutubeLinks(videos) {
  return (
    <>
      {Object.entries(videos.videos).map((video, i) => (
        <YoutubeLink video={video} key={i}/>
      ))}
    </>
  );
}
