import connectMongoDB from "@/libs/mongodb"
import playList from "@/models/playlist"
import { NextResponse } from "next/server"

export async function POST(req) {
    // try {
    //     const playlist = await req.json();
    //     await connectMongoDB();
    //     await playList.create(playlist);
    //     return NextResponse.json({ message: "PlayList created successfully" }, { status: 201 });
    // } catch (error) {
    //     return NextResponse.json({ error: error.message }, { status: 500 });
    // }
    try {
        const playlist = await req.json();
        await connectMongoDB();

        // 동일한 날짜를 가진 playlist가 있는지 확인
        const existingPlaylist = await playList.findOne({ date: playlist.date });
        if (existingPlaylist) {
            // 이미 존재하는 경우 에러 반환
            return NextResponse.json({ message: "같은 날짜 존재" }, { status: 409 });
        }

        // 새로운 playlist 저장
        await playList.create(playlist);
        return NextResponse.json({ message: "PlayList created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectMongoDB();
        const playlist = await playList.find({}).sort({ _id: -1 });
        return NextResponse.json({ playlist });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

