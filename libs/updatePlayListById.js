import { apiUrl } from "@/app/api/api"

export default async function updatePlaylist(id, playlist) {
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
        },
        body: playlist,
      });
      if (!res.ok) throw new Error("An error occurred");
      return res.json();
    } catch (e) {
      throw e;
    }
  }
  