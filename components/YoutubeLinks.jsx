import YoutubeLink from "./YoutubeLink"
export default function YoutubeLinks(videos) {
  // Object.entries(videos.videos).map((video) => {
  //   console.log(video[1]._id)
  // })
  return (
    <>
      {Object.entries(videos.videos).map((video) => (
        <YoutubeLink video={video} key={video[1]._id}/>
      ))}
    </>
  )
}
