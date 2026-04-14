import connectMongoDB from "@/libs/mongodb"
import playList from "@/models/playlist"
import { NextResponse } from "next/server"
import { auditLog, safeErrorResponse } from "@/libs/security"

const DATE_REGEX = /^\d{2}-\d{2}-\d{2}$/;

export async function GET(req, {params}){
    const {date} = await params;

    if (!DATE_REGEX.test(date)) {
        return NextResponse.json({ message: "잘못된 날짜 형식입니다. (YY-MM-DD)" }, { status: 400 });
    }

    try {
        await connectMongoDB()
        const playlist = await playList.findOne({ date })
        auditLog("PLAYLIST_READ", { method: "GET", path: `/api/playlist/${date}` });
        return NextResponse.json({ playlist }, { status: 200 })
    } catch (error) {
        return safeErrorResponse(error);
    }
}
