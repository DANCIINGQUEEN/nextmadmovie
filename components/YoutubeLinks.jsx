import YoutubeLink from "./YoutubeLink";
export default function YoutubeLinks(videos) {
  return (
    <>
      {Object.entries(videos.videos).map((video) => (
        <YoutubeLink video={video}/>
      ))}
    </>
  );
}
