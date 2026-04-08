import connectMongoDB from "@/libs/mongodb"
import playList from "@/models/playlist"
import { NextResponse } from "next/server"

const DATE_REGEX = /^\d{2}-\d{2}-\d{2}$/;

export async function GET(req, {params}){
    const {date} = await params;

    if (!DATE_REGEX.test(date)) {
        return NextResponse.json({ message: "잘못된 날짜 형식입니다. (YY-MM-DD)" }, { status: 400 });
    }

    try {
        await connectMongoDB()
        const playlist = await playList.findOne({ date })
        return NextResponse.json({ playlist }, { status: 200 })
    } catch (error) {
        console.error("GET /api/playlist/[date] error:", error)
        return NextResponse.json({ message: "요청 처리 중 오류가 발생했습니다." }, { status: 500 })
    }
}

