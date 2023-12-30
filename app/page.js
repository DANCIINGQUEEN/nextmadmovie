import PlayLists from '@/app/_components/PlayLists'
import getPlayListAll from '@/libs/getPlayListAll'

export default async function Home() {
  const playlists=await getPlayListAll()
  return <PlayLists playlists={playlists}/>
}
