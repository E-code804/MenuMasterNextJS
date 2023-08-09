import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectMongoDB();
  const { userName, password } = await req.json();
  const user = await User.findOne({ userName });

  if (user) {
    return NextResponse.json(
      { message: "User already exists" },
      {
        status: 409,
      }
    );
  }

  try {
    await User.create({ userName, password });
    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
