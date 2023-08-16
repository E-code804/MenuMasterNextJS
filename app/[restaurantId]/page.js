"use client";

import Navbar from "@/components/Navbar";
import ReviewForm from "@/components/ReviewForm";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/context";

const RestaurantPage = ({ params }) => {
  const { restaurantId } = params;
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser, restaurant, dispatch } = useGlobalContext();
  //   console.log("Restaurant Page");
  //   console.log(user);

  useEffect(() => {
    const fetchRestaurant = () => {
      fetch(`/api/restaurants/${restaurantId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Bad Restaurant ID");
          }
          return response.json();
        })
        .then((json) => {
          //setRestaurant(json)
          dispatch({ type: "SET_REVIEWS", payload: json });
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchRestaurant();
  }, [dispatch, restaurantId]);

  const handleClick = async (id) => {
    const response = await fetch(`/api/restaurants/${restaurantId}/${id}`, {
      method: "DELETE",
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_REVIEW", payload: json });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="pt-36 flex justify-center w-full">
        {isLoading ? (
          <div className="w-full bg-gray-200 px-6 py-12 rounded-lg shadow-lg">
            <div className="mx-auto mb-8 h-64 bg-gray-300 rounded-lg"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="text-center animate-pulse">
                  <div className="h-8 w-2/3 bg-gray-300 mb-2"></div>
                  <div className="h-6 w-1/2 bg-gray-300 mb-2"></div>
                  <div className="h-6 w-1/2 bg-gray-300"></div>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-lg mb-5 animate-pulse">
              <div className="h-6 w-1/3 bg-gray-300 mb-2"></div>
              <div className="h-8 w-2/3 bg-gray-300 mt-4"></div>
              <div className="h-10 w-full bg-gray-300 mt-2"></div>
              <div className="h-6 w-1/2 bg-gray-300 mt-4"></div>
              <div className="h-12 w-32 bg-gray-300 mt-4"></div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-gray-200 px-6 py-12 rounded-lg shadow-lg">
            <Image
              className="mx-auto mb-8 rounded-lg"
              src={restaurant.photo.url}
              alt="Restaurant"
              width={520}
              height={256}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Ratings and Pricing</h1>
                <p className="text-xl">
                  {restaurant.rating} ({restaurant.num_reviews})
                </p>
                <p className="text-lg">Price level: {restaurant.price_level}</p>
                <p className="text-lg">Avg Pricing: {restaurant.price}</p>
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Details</h1>
                <p className="text-lg">
                  Cuisine:{" "}
                  {restaurant.cuisine.map((cuisine, index) => (
                    <span key={index}>
                      {cuisine}
                      {index !== restaurant.cuisine.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Location</h1>
                <p className="text-lg">{restaurant.location_string}</p>
                <p className="text-lg">{restaurant.address}</p>
              </div>
            </div>

            <ReviewForm id={restaurantId} user={user} />

            {restaurant.user_reviews.map((rev) => (
              <div key={rev.revId} className="bg-white p-5 rounded-lg mb-5">
                <h1 className="text-lg font-bold">
                  {rev.userName} - {rev.createdAt}
                </h1>
                <h2 className="text-xl mt-2">Rated: {rev.ratingReview}</h2>
                <p className="mt-4">{rev.writtenReview}</p>
                {rev.userName === user.userName && (
                  <span
                    className="bg-red-500 text-white cursor-pointer py-2 px-4 rounded mt-4 inline-block"
                    onClick={() => handleClick(rev.revId)}
                  >
                    Delete
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;
