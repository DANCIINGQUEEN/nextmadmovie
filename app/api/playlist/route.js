import connectMongoDB from "@/libs/mongodb"
import playList from "@/models/playlist"
import { NextResponse } from "next/server"
import { checkAdminSecret } from "@/libs/apiAuth"
import { sanitize, validatePlaylistBody, auditLog, safeErrorResponse } from "@/libs/security"

export async function POST(req) {
    const authError = checkAdminSecret(req);
    if (authError) {
        auditLog("AUTH_FAIL", { method: "POST", path: "/api/playlist" });
        return authError;
    }

    try {
        const rawBody = await req.json();
        const playlist = sanitize(rawBody);

        const validationError = validatePlaylistBody(playlist);
        if (validationError) {
            return NextResponse.json({ message: validationError }, { status: 400 });
        }

        // Only allow whitelisted fields
        const safeData = {
            date: playlist.date,
            video: playlist.video.map((v) => ({
                title: v.title,
                link: v.link,
            })),
        };

        await connectMongoDB();

        const existingPlaylist = await playList.findOne({ date: safeData.date });
        if (existingPlaylist) {
            return NextResponse.json({ message: "같은 날짜 존재" }, { status: 409 });
        }

        await playList.create(safeData);
        auditLog("PLAYLIST_CREATE", { method: "POST", path: "/api/playlist", detail: safeData.date });
        return NextResponse.json({ message: "PlayList created successfully" }, { status: 201 });
    } catch (error) {
        return safeErrorResponse(error);
    }
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
        const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT));
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
        return safeErrorResponse(error);
    }
}
