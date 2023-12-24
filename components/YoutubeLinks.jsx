export default function YoutubeLinks(videos) {
   
    return(
        <>
        {
            Object.entries(videos.videos).map((video) => (
                <div key={video[1]._id}>
                    <a href={video.url} target="_blank">
                        {/* <img src={video.thumbnail} alt={video.title}/> */}
                        <p>{video[1].title}</p>
                    </a>
                </div>
            ))
        }
        
        </>
    )
}