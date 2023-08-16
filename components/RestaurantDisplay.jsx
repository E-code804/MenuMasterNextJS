"use client";
import React, { useEffect, useState } from "react";
import QueryForm from "./QueryForm";
import Restaurant from "./Restaurant";

const RestaurantDisplay = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [origRestaurants, setOrigRestaurants] = useState([]);
  const url = process.env.API_URL;
  console.log(url);

  useEffect(() => {
    const fetchRestaurants = () => {
      fetch(`/api/restaurants/`, { cache: "no-store" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Bad Restaurant ID");
          }
          return response.json();
        })
        .then((json) => {
          setRestaurants(json);
          setOrigRestaurants(json);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchRestaurants();
  }, [url]);
  // db only needs to store the number of reviews, rating, and user reviews.
  // useEffect(() => {
  //   const fetchRestaurants = async () => {
  //     const response = await fetch(
  //       "https://travel-advisor.p.rapidapi.com/restaurants/list?location_id=293919",
  //       {
  //         method: "GET",
  //         headers: {
  //           "X-RapidAPI-Key":
  //             "",
  //           "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
  //         },
  //         cache: "no-store",
  //       }
  //     );
  //     const json = await response.json();
  //     //console.log(process.env.TRIP_KEY);

  //     if (!response.ok) {
  //       console.log("error");
  //     } else {
  //       // setOrigRestaurants(json.data);
  //       // setRestaurants(json.data);
  //       // console.log(restaurants);
  //       console.log(json.data);
  //     }
  //   };
  //   fetchRestaurants();
  // });

  return (
    <div id="scrollTarget" className="display-restaurants w-full padding-x">
      {/* Have a Form input for filtering based on ratings and price level. */}
      <div className="w-full flex flex-col items-center">
        <h1
          id="rest-display-title"
          className="mt-4 2xl:text-[48px] sm:text-[32px] text-[50px] max-sm:text-[48px] font-extrabold"
        >
          Discover something new
        </h1>
        <QueryForm
          origRestaurants={origRestaurants}
          setRestaurants={setRestaurants}
        />
      </div>
      <div className="container px-5 py-24 mx-auto flex flex-wrap justify-center">
        {restaurants &&
          restaurants.map((r) => (
            <Restaurant
              key={r._id}
              id={r._id}
              name={r.name}
              url={r.photo.url}
              rating={r.rating}
              num_reviews={r.num_reviews}
            />
          ))}
      </div>
    </div>
  );
};

export default RestaurantDisplay;
