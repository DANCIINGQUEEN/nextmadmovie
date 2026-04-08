import connectMongoDB from "@/libs/mongodb";
import playList from "@/models/playlist";
import { NextResponse } from "next/server";
import { checkAdminSecret } from "@/libs/apiAuth";

export async function PUT(req, { params }) {
  const authError = checkAdminSecret(req);
  if (authError) return authError;

  try {
    const playlist = await req.json();
    const { id } = await params;
    await connectMongoDB();
    await playList.findByIdAndUpdate(id, playlist);
    return NextResponse.json({ message: "수정 완료" }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/[id] error:", error);
    return NextResponse.json({ message: "요청 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const authError = checkAdminSecret(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    await connectMongoDB();
    await playList.findByIdAndDelete(id);
    return NextResponse.json({ message: "삭제 완료" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/[id] error:", error);
    return NextResponse.json({ message: "요청 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
