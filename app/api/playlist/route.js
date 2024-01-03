import connectMongoDB from "@/libs/mongodb"
import playList from "@/models/playlist"
import { NextResponse } from "next/server"

export async function POST(req) {
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

