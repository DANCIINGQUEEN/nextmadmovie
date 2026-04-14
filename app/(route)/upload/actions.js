"use server";
import connectMongoDB from "@/libs/mongodb";
import playList from "@/models/playlist";
import { sanitize, validatePlaylistBody, auditLog } from "@/libs/security";
import { revalidatePath } from "next/cache";

export async function uploadPlaylistAction(jsonStr) {
  let body;
  try {
    body = JSON.parse(jsonStr);
  } catch {
    return { error: "JSON 형식이 올바르지 않습니다." };
  }

  const sanitized = sanitize(body);
  const validationError = validatePlaylistBody(sanitized);
  if (validationError) return { error: validationError };

  const safeData = {
    date: sanitized.date,
    video: sanitized.video.map(({ title, link }) => ({ title, link })),
  };

  await connectMongoDB();
  const existing = await playList.findOne({ date: safeData.date });
  if (existing) return { error: "같은 날짜 존재" };

  await playList.create(safeData);
  auditLog("PLAYLIST_CREATE", { method: "SERVER_ACTION", path: "/upload", detail: safeData.date });
  revalidatePath("/");
  return { success: true };
}
