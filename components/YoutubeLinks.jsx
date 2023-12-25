import YoutubeLink from "./YoutubeLink"
export default function YoutubeLinks(videos) {
  // Object.entries(videos.videos).map((video, i) => {
  //   console.log(video, i)
  // })
  return (
    <>
      {Object.entries(videos.videos).map((video, i) => (
        <YoutubeLink video={video} key={video[1]._id}/>
      ))}
    </>
  )
}
