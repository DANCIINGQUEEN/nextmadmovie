import connectMongoDB from "@/libs/mongodb"
import playList from "@/models/playlist"
import { NextResponse } from "next/server"

export async function GET(req, {params}){
    try {
        const {date}=params
        await connectMongoDB()
        const playlist=await playList.findOne({date})
        return NextResponse.json({playlist}, {status:200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'An error occurred'}, {status:500})
    }
}

