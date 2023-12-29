import connectMongoDB from "@/libs/mongodb";
import playList from "@/models/playlist";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const playlist = await req.json();
  const id = params.id;
  await connectMongoDB();
  await playList.findByIdAndUpdate(id, playlist);
  return NextResponse.json({ msg: "edited" }, { status: 200 });
}

export async function DELETE(req, { params }) {
  const id = params.id;
  await connectMongoDB();
  await playList.findByIdAndDelete(id);
  return NextResponse.json({ msg: "deleted" }, { status: 200 });
}
