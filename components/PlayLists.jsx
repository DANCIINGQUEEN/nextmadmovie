import PlayList from "./PlayList";
import styles from "./components.module.css";
import { apiUrl } from "../app/api/api";

const getPlaylists = async () => {
  try {
    const res = await fetch(`${apiUrl}/playlist`);
    const playlists = await res.json();
    return { playlists };
  } catch (e) {
    console.log(e);
  }
};
export default async function PlayLists() {
  const { playlists } = await getPlaylists();
  return (
    <>
      {Object.entries(playlists.playlist).map((playlist) => (
        <PlayList playlist={playlist} key={playlist._id} />
      ))}
    </>
  );
}
