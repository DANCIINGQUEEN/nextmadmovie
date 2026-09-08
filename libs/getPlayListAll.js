import mongoose from 'mongoose';
import playList from '@/models/playlist';
export default async function getPlayListAll() {
 if (!process.env.MONGODB_URI) return null;
 try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  const playlist = await playList.find({}).sort({ date: -1 }).lean();
  return { playlist: JSON.parse(JSON.stringify(playlist)) };
 } catch {
  console.error('Playlist database unavailable; using the saved archive.');
  return null;
 }
}
