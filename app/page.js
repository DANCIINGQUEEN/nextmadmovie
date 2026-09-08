import Archive from './_components/Archive';
import getPlayListAll from '@/libs/getPlayListAll';
import oldPlayLists from '@/libs/oldplaylists';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const result = await getPlayListAll();
  const groups = new Map();
  for (const entry of [...(result?.playlist ?? []), ...oldPlayLists]) {
    const group = groups.get(entry.date) ?? {
      date: entry.date,
      video: []
    };
    for (const video of entry.video) if (!group.video.some(item => item.link === video.link)) group.video.push(video);
    groups.set(entry.date, group);
  }
  const sortKey = date => /^\d{2}-\d{2}-\d{2}$/.test(date) ? `20${date}` : /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '';
  return <Archive playlists={[...groups.values()].sort((a, b) => sortKey(b.date).localeCompare(sortKey(a.date)))} offline={!result} />;
}
