"use client";
import { useGlobalContext } from "@/app/context/context";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import ErrorMsg from "./ErrorMsg";

// make a lot of components

const Navbar = () => {
  const [displaySignIn, setDisplaySignIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { user, setUser } = useGlobalContext();
  const url = process.env.API_URL;
  // console.log("Navbar");
  // console.log(user);

  const handleSignInClick = () => {
    // If the user is empty, user has not signed in yet so display sign in
    if (isObjectEmpty(user)) {
      setDisplaySignIn(true);
    } else {
      setUser({});
    }
  };

  const handleEnterClick = async (action) => {
    if (action === "in") {
      fetch(`/api/users/${userName}`)
        .then((response) => {
          if (!response.ok) {
            throw Error(
              "User not found, enter correct info or create new user."
            );
          } else {
            return response.json();
          }
        })
        .then((json) => {
          setUser(json.user);
          setDisplaySignIn(false);
          setErrorMessage("");
        })
        .catch((err) => {
          setErrorMessage(err.message);
        });
    } else {
      fetch(`/api/users/`, {
        method: "POST",
        body: JSON.stringify({ userName, password }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw Error("This username already exists.");
          }
          return response.json();
        })
        .then((json) => {
          setUser(json.user);
          setDisplaySignIn(false);
          setErrorMessage("");
        })
        .catch((err) => {
          setErrorMessage(err.message);
        });
    }
    setUserName("");
    setPassword("");
  };

  const isObjectEmpty = (obj) => {
    return obj && Object.keys(obj).length === 0;
  };

  // Add X for the sign in.

  return (
    <header className="w-full absolute z-10">
      {displaySignIn && (
        <div className="confirm-delete">
          <div className="delete-container">
            <div className="w-full flex justify-between">
              <h1 className="mb-3">Please enter your credentials</h1>
              <IoCloseOutline
                onClick={() => setDisplaySignIn(false)}
                size={24}
                className="text-red-500 cursor-pointer"
              />
            </div>
            <input
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p>To demo: username=Demo, password=demo123</p>
            <div className="mt-3 w-full flex ">
              <button
                className="rounded-md p-2 mr-2 bg-blue-500 text-white"
                onClick={() => handleEnterClick("in")}
              >
                Sign In
              </button>
              <button
                className="bg-green-600 text-white rounded-md p-2"
                onClick={() => handleEnterClick("create")}
              >
                Create Account
              </button>
            </div>
            {errorMessage.length > 0 && (
              <ErrorMsg errorMessage={errorMessage} />
            )}
          </div>
        </div>
      )}
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4">
        <Link href="/">
          <div className="flex justify-center items-center cursor-pointer">
            <Image width={48} height={48} src="/images/icon.png" alt="logo" />
            <p className="nav-logo-text">Menu Master</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleSignInClick}
          className="custom-btn sign-in"
        >
          {isObjectEmpty(user) ? "Sign In" : "Sign Out"}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
