import { apiUrl } from "@/app/api/api";
export default async function getPlayListAll() {
    try{
        const res=await fetch(`${apiUrl}/playlist`, { cache: 'no-store' })
        if(!res.ok){
            throw new Error("An error occurred")
        }
        const playlists=await res.json()
        return playlists
    }catch(e){
        console.error(e)
    }
}