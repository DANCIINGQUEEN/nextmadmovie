import connectMongoDB from "@/libs/mongodb"
import playList from "@/models/playlist"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const playlist = await req.json();
        await connectMongoDB();
        await playList.create(playlist);
        return NextResponse.json({ message: "PlayList created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
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