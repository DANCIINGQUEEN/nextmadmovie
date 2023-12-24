import connectMongoDB from "@/libs/mongodb"
import playList from "@/models/playlist"
import { NextResponse } from "next/server"

export async function GET(){
    await connectMongoDB()
    const playlist = await playList.find({}).sort({_id: -1})
    return NextResponse.json({playlist})
}