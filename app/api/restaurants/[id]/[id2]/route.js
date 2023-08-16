import connectMongoDB from "@/libs/mongodb";
import Restaurant from "@/models/restaurant";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { id, id2 } = params;
  connectMongoDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Bad restaurant ID." }, { status: 404 });
  }

  const currentRestaurant = await Restaurant.findById(id);

  if (!currentRestaurant) {
    return NextResponse.json({ error: "No such restaurant" }, { status: 404 });
  }

  const currentRating = parseFloat(currentRestaurant.rating);
  const currentNumReviews = parseInt(currentRestaurant.num_reviews);

  if (!currentRestaurant) {
    return NextResponse.json({ error: "No such restaurant" }, { status: 404 });
  }

  const userReview = currentRestaurant.user_reviews.find(
    (review) => review.revId === id2
  );

  if (!userReview) {
    return NextResponse.json({ error: "No such review" }, { status: 404 });
  }

  const oldRating = userReview.ratingReview;
  // make a var for ratingView that is 0 in this scenario for func refactor.
  const newRating =
    (currentRating * currentNumReviews - oldRating) / (currentNumReviews - 1);

  const updatedReview = await Restaurant.updateOne(
    { _id: id },
    {
      $set: {
        rating: newRating.toFixed(1).toString(),
        num_reviews: (currentNumReviews - 1).toString(),
      },
      $pull: { user_reviews: { revId: id2 } },
    }
  );
  if (updatedReview.modifiedCount > 0) {
    return NextResponse.json(
      { id2, newRating, numReviews: currentNumReviews - 1 },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { error: "Could not update review" },
      { status: 404 }
    );
  }
}

export async function PATCH(req, { params }) {
  const { id, id2 } = params;
  const { writtenReview, ratingReview } = await req.json();
  connectMongoDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Bad restaurant ID." }, { status: 404 });
  }

  const currentRestaurant = await Restaurant.findById(id);

  if (!currentRestaurant) {
    return NextResponse.json({ error: "No such restaurant" }, { status: 404 });
  }

  const currentRating = parseFloat(currentRestaurant.rating);
  const numReviews = parseInt(currentRestaurant.num_reviews);

  const foundRestaurantWithReview = await Restaurant.findOne({
    _id: id,
    "user_reviews.revId": id2,
  });

  if (!foundRestaurantWithReview) {
    return NextResponse.json({ error: "No such review" }, { status: 404 });
  }

  const userReview = foundRestaurantWithReview.user_reviews.find(
    (review) => review.revId === id2
  );

  if (!userReview) {
    return NextResponse.json({ error: "No such review" }, { status: 404 });
  }
  const oldRating = userReview.ratingReview;
  const newRating =
    (currentRating * numReviews - oldRating + ratingReview) / numReviews;
  const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, {
    rating: newRating.toString(),
  });

  const updatedReview = await Restaurant.updateOne(
    {
      _id: id,
      "user_reviews.revId": id2,
    },
    {
      $set: {
        "user_reviews.$.ratingReview": ratingReview,
        "user_reviews.$.writtenReview": writtenReview,
      },
    }
  );

  if (updatedReview.modifiedCount > 0) {
    return NextResponse.json({ msg: "Updated" }, { status: 200 });
  } else {
    return NextResponse.json(
      { error: "Could not update review" },
      { status: 404 }
    );
  }
}
