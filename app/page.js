import PlayLists from "@/app/_components/PlayLists";
import getPlayListAll from "@/libs/getPlayListAll";
import { PageNumberProvider } from "@/context/PageNumberContext";
import { SearchTermProvider } from "@/context/SearchTermContext";

export const dynamic = "force-dynamic";

export default async function Home() {
  const playlists = await getPlayListAll();
  return (
    <PageNumberProvider>
      <SearchTermProvider>
      <PlayLists playlists={playlists} />
      </SearchTermProvider>
    </PageNumberProvider>
  );
}
