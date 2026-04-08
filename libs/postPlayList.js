import { apiUrl } from "@/app/api/api";
export default async function postPlaylist(playlist){
    try{
        const res=await fetch(`${apiUrl}/playlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
            },
            body: playlist,
        });
        if(!res.ok) throw new Error("An error occurred");
    }catch(e){
        throw e;
    }
}