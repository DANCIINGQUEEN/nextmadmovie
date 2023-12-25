import YoutubeLink from "./YoutubeLink"
export default function YoutubeLinks({videos}) {
  return (
    <>
      {Object.entries(videos).map((video) => (
        <YoutubeLink video={video} key={video[1]._id}/>
      ))}
    </>
  )
}