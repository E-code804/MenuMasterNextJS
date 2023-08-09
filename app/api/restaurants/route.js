import connectMongoDB from "@/libs/mongodb";
import Restaurant from "@/models/restaurant";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectMongoDB();
  const topics = await Restaurant.find();
  return NextResponse.json(topics);
}
