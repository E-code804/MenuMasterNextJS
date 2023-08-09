"use client";
import { useGlobalContext } from "@/app/context/context";
import { useState } from "react";
import ErrorMsg from "./ErrorMsg";

const ReviewForm = ({ id, user }) => {
  const [writtenReview, setWrittenReview] = useState("");
  const [ratingReview, setRatingReview] = useState(0);
  const [displayError, setDisplayError] = useState(false);
  const { dispatch } = useGlobalContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.userName === undefined) {
      setDisplayError(true);
      setWrittenReview("");
      setRatingReview(0);
      return;
    }

    const userName = user.userName;
    setDisplayError(false);
    const review = {
      userName,
      writtenReview,
      ratingReview: parseFloat(ratingReview),
    };

    fetch(`/api/restaurants/${id}`, {
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Bad Restaurant ID");
        }
        setWrittenReview("");
        setRatingReview(0);
        return response.json();
      })
      .then((json) => {
        dispatch({ type: "CREATE_REVIEW", payload: json });
      });
  };
  return (
    <form className="mb-3" onSubmit={handleSubmit}>
      <label>Add your review</label>
      <input
        type="text"
        onChange={(e) => setWrittenReview(e.target.value)}
        value={writtenReview}
      />
      <label>Give a rating (1-5)</label>
      <input
        type="number"
        onChange={(e) => setRatingReview(e.target.value)}
        value={ratingReview}
      />
      <button className="mb-3 bg-red-500">Submit</button>
      {displayError && (
        <ErrorMsg errorMessage="Please be sure to sign in to review" />
      )}
    </form>
  );
};

export default ReviewForm;
