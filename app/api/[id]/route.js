import connectMongoDB from "@/libs/mongodb";
import playList from "@/models/playlist";
import { NextResponse } from "next/server";
import { checkAdminSecret } from "@/libs/apiAuth";
import { sanitize, isValidObjectId, auditLog, safeErrorResponse } from "@/libs/security";

export async function PUT(req, { params }) {
  const authError = checkAdminSecret(req);
  if (authError) {
    auditLog("AUTH_FAIL", { method: "PUT", path: "/api/[id]" });
    return authError;
  }

  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "잘못된 ID 형식입니다." }, { status: 400 });
    }

    const rawBody = await req.json();
    const playlist = sanitize(rawBody);

    // Only allow whitelisted fields for update
    const safeData = {};
    if (playlist.date) safeData.date = playlist.date;
    if (Array.isArray(playlist.video)) {
      safeData.video = playlist.video.map((v) => ({
        title: v.title,
        link: v.link,
      }));
    }

    await connectMongoDB();
    const result = await playList.findByIdAndUpdate(id, safeData);

    if (!result) {
      return NextResponse.json({ message: "해당 ID를 찾을 수 없습니다." }, { status: 404 });
    }

    auditLog("PLAYLIST_UPDATE", { method: "PUT", path: `/api/${id}` });
    return NextResponse.json({ message: "수정 완료" }, { status: 200 });
  } catch (error) {
    return safeErrorResponse(error);
  }
}

export async function DELETE(req, { params }) {
  const authError = checkAdminSecret(req);
  if (authError) {
    auditLog("AUTH_FAIL", { method: "DELETE", path: "/api/[id]" });
    return authError;
  }

  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "잘못된 ID 형식입니다." }, { status: 400 });
    }

    await connectMongoDB();
    const result = await playList.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ message: "해당 ID를 찾을 수 없습니다." }, { status: 404 });
    }

    auditLog("PLAYLIST_DELETE", { method: "DELETE", path: `/api/${id}` });
    return NextResponse.json({ message: "삭제 완료" }, { status: 200 });
  } catch (error) {
    return safeErrorResponse(error);
  }
}
