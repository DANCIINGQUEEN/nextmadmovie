import { apiUrl } from "@/app/api/api";
import oldPlayLists1 from "./oldplaylists1";
import oldPlayLists2 from "./oldplaylists2";
import oldPlayLists3 from "./oldplaylists3";
import oldPlayLists4 from "./oldplaylists4";
export default async function getPlayListAll() {
    try{
        const res=await fetch(`${apiUrl}/playlist`, { cache: 'no-store' })
        if(!res.ok){
            throw new Error("An error occurred")
        }
        let playlists=await res.json()
        return playlists
    }catch(e){
        console.error(e)
    }
}