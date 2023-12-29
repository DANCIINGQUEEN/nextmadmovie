import { apiUrl } from "@/app/api/api";
export default async function deletePlaylist(id){
    try{
        const res=await fetch(`${apiUrl}/${id}`,{
            method:"DELETE"
        })
        if(!res.ok) throw new Error("An error occurred")
    }catch(e){
        throw e
    }
}