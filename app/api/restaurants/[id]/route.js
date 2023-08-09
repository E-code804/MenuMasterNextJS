import connectMongoDB from "@/libs/mongodb";
import Restaurant from "@/models/restaurant";
import format from "date-fns/format";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req, { params }) {
  const { id } = params;
  connectMongoDB();
  // Make sure id is a valid mongodb id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid restaurant id" },
      { status: 404 }
    );
  }
  const restaurant = await Restaurant.findById(id);

  if (!restaurant) {
    return NextResponse.json({ error: "No such restaurant" }, { status: 404 });
  }
  return NextResponse.json(restaurant, { status: 200 });
}

export async function POST(req, { params }) {
  const { userName, writtenReview, ratingReview } = await req.json();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "No such restaurant" }, { status: 404 });
  }

  const rest = await Restaurant.findById(id);
  const revId = uuidv4();

  if (!rest) {
    return NextResponse.json({ error: "No such restaurant" }, { status: 404 });
  }

  // add doc to db
  try {
    const review = {
      revId,
      userName,
      writtenReview,
      ratingReview,
      createdAt: format(new Date(), "yyyy-MM-dd"),
    };
    // When a new review is created, we must update its rating and the number of reviews.
    const currentRating = parseFloat(rest.rating);
    const currentNumReviews = parseInt(rest.num_reviews);
    const newRating =
      (currentRating * currentNumReviews + ratingReview) /
      (currentNumReviews + 1);

    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: id },
      {
        rating: newRating.toFixed(1).toString(),
        num_reviews: (currentNumReviews + 1).toString(),
      }
    );

    if (!restaurant) {
      return NextResponse.json(
        { error: "No such restaurant" },
        { status: 404 }
      );
    }

    rest.user_reviews.push(review);
    await rest.save();
    const numReview = currentNumReviews + 1;
    return NextResponse.json({ review, newRating, numReview }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
