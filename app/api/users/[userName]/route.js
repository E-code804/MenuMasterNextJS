import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userName } = params;
  await connectMongoDB();
  const user = await User.findOne({ userName });

  if (!user) {
    return NextResponse.json({ error: "No such user" }, { status: 404 });
  }
  return NextResponse.json({ user }, { status: 200 });
}
