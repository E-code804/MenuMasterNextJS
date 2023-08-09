"use client";
import { useState } from "react";

const QueryForm = ({ restaurants, origRestaurants, setRestaurants }) => {
  const [price, setPrice] = useState("None");
  const [cuisine, setCuisine] = useState("None");
  const cuisineSet = new Set();
  cuisineSet.add("None");

  // Store all cuisines into the set
  origRestaurants.forEach((r) => {
    r.cuisine.forEach((c) => cuisineSet.add(c));
  });

  const inPriceRange = (restaurantPriceRange) => {
    if (restaurantPriceRange === "$") {
      return restaurantPriceRange === price;
    } else if (restaurantPriceRange === "$$") {
      return restaurantPriceRange === price;
    } else if (restaurantPriceRange.replace(/\s/g, "") === "$$-$$$") {
      return price === "$$" || price === "$$$";
    } else if (restaurantPriceRange === "$$$$") {
      return restaurantPriceRange === price;
    } else {
      return false;
    }
  };

  // handleSubmit will return the array given in the props
  const handleSubmit = (e) => {
    e.preventDefault();
    // send the setRestaurants down here
    var newRestaurants = [];

    newRestaurants = origRestaurants.filter((r) => {
      if (price === "None" && cuisine === "None") {
        return true;
      } else if (price !== "None" && cuisine === "None") {
        return inPriceRange(r.price_level);
      } else if (price === "None" && cuisine !== "None") {
        return r.cuisine.includes(cuisine);
      } else {
        return inPriceRange(r.price_level) && r.cuisine.includes(cuisine);
      }
    });
    setRestaurants(newRestaurants);
  };
  return (
    <form onSubmit={handleSubmit} className="flex mt-4 flex-col items-center">
      <label htmlFor="prices" className="font-bold text-lg mb-2  text-white">
        Select a price range
      </label>
      <select
        id="prices"
        name="prices"
        onChange={(e) => setPrice(e.target.value)}
        className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
      >
        <option value="None">None</option>
        <option value="$">$</option>
        <option value="$$">$$</option>
        <option value="$$$">$$$</option>
        <option value="$$$$">$$$$</option>
      </select>

      <label
        htmlFor="cuisine"
        className="font-bold text-lg mt-4 mb-2 text-white"
      >
        Select your preferred cuisine
      </label>
      <select
        id="cuisine"
        name="cuisine"
        onChange={(e) => setCuisine(e.target.value)}
        className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
      >
        {[...cuisineSet].map((cuisine) => (
          <option key={cuisine} value={cuisine}>
            {cuisine}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="mt-6 px-6 py-2 bg-red-900 text-white rounded-lg shadow-lg hover:bg-red-950 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Submit
      </button>
    </form>
  );
};

export default QueryForm;
