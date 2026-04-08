import connectMongoDB from "@/libs/mongodb"
import playList from "@/models/playlist"
import { NextResponse } from "next/server"
import { checkAdminSecret } from "@/libs/apiAuth"

export async function POST(req) {
    const authError = checkAdminSecret(req);
    if (authError) return authError;

    try {
        const playlist = await req.json();
        await connectMongoDB();

        const existingPlaylist = await playList.findOne({ date: playlist.date });
        if (existingPlaylist) {
            return NextResponse.json({ message: "같은 날짜 존재" }, { status: 409 });
        }
        await playList.create(playlist);
        return NextResponse.json({ message: "PlayList created successfully" }, { status: 201 });
    } catch (error) {
        console.error("POST /api/playlist error:", error);
        return NextResponse.json({ message: "요청 처리 중 오류가 발생했습니다." }, { status: 500 });
    }
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
        const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10)));
        const skip = (page - 1) * limit;

        await connectMongoDB();
        const [playlist, total] = await Promise.all([
            playList.find({}).sort({ _id: -1 }).skip(skip).limit(limit),
            playList.countDocuments(),
        ]);

        return NextResponse.json({
            playlist,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("GET /api/playlist error:", error);
        return NextResponse.json({ message: "요청 처리 중 오류가 발생했습니다." }, { status: 500 });
    }
}

