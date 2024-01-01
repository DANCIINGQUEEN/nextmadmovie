import { apiUrl } from "@/app/api/api"
const getPlaylistByDate = async (date) => {
    try {
      const res = await fetch(`${apiUrl}/playlist/${date}`, {cache: "no-store"});
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    } catch (e) {
      console.error(e);
    }
  };

export default getPlaylistByDate;