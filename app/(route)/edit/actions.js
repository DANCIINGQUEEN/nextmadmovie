"use server";
import connectMongoDB from "@/libs/mongodb";
import playList from "@/models/playlist";
import { sanitize, isValidObjectId, auditLog } from "@/libs/security";
import { revalidatePath } from "next/cache";

export async function updatePlaylistAction(id, jsonStr) {
  if (!isValidObjectId(id)) return { error: "잘못된 ID 형식입니다." };

  let body;
  try {
    body = JSON.parse(jsonStr);
  } catch {
    return { error: "JSON 형식이 올바르지 않습니다." };
  }

  const sanitized = sanitize(body);
  const safeData = {};
  if (sanitized.date) safeData.date = sanitized.date;
  if (Array.isArray(sanitized.video)) {
    safeData.video = sanitized.video.map(({ title, link }) => ({ title, link }));
  }

  await connectMongoDB();
  const result = await playList.findByIdAndUpdate(id, safeData);
  if (!result) return { error: "해당 항목을 찾을 수 없습니다." };

  auditLog("PLAYLIST_UPDATE", { method: "SERVER_ACTION", path: `/edit/${id}` });
  revalidatePath("/");
  return { success: true };
}

export async function deletePlaylistAction(id) {
  if (!isValidObjectId(id)) return { error: "잘못된 ID 형식입니다." };

  await connectMongoDB();
  const result = await playList.findByIdAndDelete(id);
  if (!result) return { error: "해당 항목을 찾을 수 없습니다." };

  auditLog("PLAYLIST_DELETE", { method: "SERVER_ACTION", path: `/edit/${id}` });
  revalidatePath("/");
  return { success: true };
}
