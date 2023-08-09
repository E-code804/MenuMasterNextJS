"use client";

import { createContext, useContext, useReducer, useState } from "react";

const GlobalContext = createContext(null);

const newRating = (val) => {
  return val > 5.0 ? 5.0 : val;
};

// state is a previous state. action is on obj w a type and payload.
export const reviewsReducer = (state, action) => {
  switch (action.type) {
    case "SET_REVIEWS":
      return {
        restaurant: action.payload,
      };
    case "CREATE_REVIEW":
      return {
        restaurant: {
          ...state.restaurant,
          rating: newRating(action.payload.newRating.toFixed(2)),
          num_reviews: action.payload.numReview,
          user_reviews: [
            ...state.restaurant.user_reviews,
            action.payload.review,
          ],
        },
      };
    case "DELETE_REVIEW":
      return {
        restaurant: {
          ...state.restaurant,
          rating: newRating(action.payload.newRating.toFixed(2)),
          num_reviews: action.payload.numReviews,
          user_reviews: state.restaurant.user_reviews.filter(
            (rev) => rev.revId !== action.payload.id2
          ),
        },
      };

    default:
      return state;
  }
};

export const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [state, dispatch] = useReducer(reviewsReducer, {
    restaurant: null,
  });

  return (
    <GlobalContext.Provider value={{ user, setUser, ...state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
