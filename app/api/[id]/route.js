import connectMongoDB from "@/libs/mongodb"
import playList from "@/models/playlist"
import { NextResponse } from "next/server"

export async function PUT(req, {params}){
    const playlist=await req.json()
    const id=params.id
    await connectMongoDB()
    await playList.findByIdAndUpdate(id,playlist)
    return NextResponse.json({playlist, id},{ status:200})
}