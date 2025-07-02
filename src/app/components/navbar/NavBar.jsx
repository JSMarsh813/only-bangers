"use client";

// can't change to tsx until material-tailwind finally supports react 19 https://github.com/creativetimofficial/material-tailwind/issues/664

// needed to avoid the error: TypeError: (0 , _react.createContext) is not a function
//https://stackoverflow.com/questions/74255356/typeerror-react-createcontext-is-not-a-function-nextjs-13-formik-with-typesc
import { useUser } from "../context-wrappers/UserInfo";
import Link from "next/link";
import React, { Children, useContext, useEffect, useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import signOutUser from "@/utils/signOutUser";

function NavList() {
  const [error, setError] = React.useState(null);
  const router = useRouter();
  const { currentUsersInfo, setTriggerRecheck, triggerRecheck } = useUser();

  const userName = currentUsersInfo.user_name;

  const handleSignout = async function (event) {
    // event.preventDefault(); is not needed, because the signOutUser utility function has it

    //if I didn't want to do router.push("login") and show errors to the users, I could of directly called the server action for signing out with form action prop

    //since I DO want to do extra actions, I made a utility function (signOutUser) that makes an api call to access that server action

    // why can APIs do server actions? because api calls are executed on the server, not in the browser

    try {
      await signOutUser({ event, setTriggerRecheck });
      router.push("/login");
    } catch (error) {
      console.log("log out was not successful", error);
      setError("Error! Log out was not successful");
    }

    // Originally I did the redirect in the server logic for deletesession

    // when I first used redirect("/login") I got these errors:

    //Uncaught (in promise) Error: NEXT_REDIRECT
    //Uncaught (in promise) TypeError: NetworkError when attempting to fetch resource.
    // solution? useRouter since this is client side. redirect is for the server-side redirects

    // so you get the network error because that server function redirect, is not available in the browser
  };

  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row items-center lg:gap-6">
      <Typography
        as="li"
        variant="paragraph"
        placeholder={""}
        color="blue-gray"
        className="p-1  hover:border-x-2 hover:border-blue-200 px-4 "
      >
        <Link
          href="/"
          className="text-xl font-semibold flex items-center hover:text-blue-200 transition-colors"
        >
          {`Welcome ${userName}`}
        </Link>
      </Typography>

      <Typography
        as="li"
        variant="paragraph"
        color="blue-gray"
        className="p-1 font-medium hover:border-x-2 hover:border-blue-200 px-4 "
      >
        <Link
          href="/"
          className="flex items-center hover:text-blue-200 transition-colors"
        >
          Home
        </Link>
      </Typography>

      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-medium hover:border-x-2 hover:border-blue-200 px-4 "
      >
        <Link
          href="/general-resources"
          className="flex items-center hover:text-blue-200 transition-colors"
        >
          Resources
        </Link>
      </Typography>

      <Typography
        as="li"
        variant="medium"
        color="blue-gray"
        className="p-1 font-medium hover:border-x-2 hover:border-blue-200 px-4 "
      >
        <Link
          href="/general-submission"
          className="flex items-center hover:text-blue-200 transition-colors"
        >
          Submit
        </Link>
      </Typography>

      {userName !== "guest" && (
        <Typography
          as="li"
          variant="medium"
          color="blue-gray"
          className="p-1 font-medium hover:border-x-2 hover:border-blue-200 px-4 "
        >
          <Link
            href="/dashboard"
            className="flex items-center hover:text-blue-200 transition-colors"
          >
            Dashboard
          </Link>
        </Typography>
      )}

      {userName === "guest" && (
        <Typography
          as="li"
          variant="medium"
          color="blue-gray"
          className="p-1 font-medium hover:border-x-2 hover:border-blue-200 px-4 "
        >
          <Link
            href="/login"
            className="flex items-center hover:text-blue-200 transition-colors"
          >
            Login
          </Link>
        </Typography>
      )}

      {userName === "guest" && (
        <Typography
          as="li"
          variant="medium"
          color="blue-gray"
          className="p-1 font-medium hover:border-x-2 hover:border-blue-200 px-4 bg-blue-950 rounded-lg py-2"
        >
          <Link
            href="/signup"
            className="flex items-center hover:text-blue-200 transition-colors"
          >
            Sign Up
          </Link>
        </Typography>
      )}

      {userName !== "guest" && (
        <Typography
          as="li"
          variant="medium"
          color="blue-gray"
          className="p-1 font-medium hover:border-x-2 hover:border-blue-200 px-4 bg-blue-950 rounded-lg py-2"
        >
          <form onSubmit={handleSignout}>
            <button
              className="flex items-center hover:text-blue-200 transition-colors"
              type="submit"
            >
              Logout
            </button>
          </form>
        </Typography>
      )}
    </ul>
  );
}

export default function NavbarSimple() {
  const [openNav, setOpenNav] = React.useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Navbar className="rounded-none mx-auto px-6 py-3 text-white text-3xl  bg-blue-800 border-none">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="/"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 text-2xl"
        >
          Only Bangers
        </Typography>
        {/* ######## Desktop Nav Hidden on small screens ############*/}

        <div className="hidden lg:block">
          <NavList />
        </div>
        {/* ######## Mobile Nav hidden on large screens ############*/}

        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon
              className="h-6 w-6"
              strokeWidth={2}
            />
          ) : (
            <Bars3Icon
              className="h-6 w-6"
              strokeWidth={2}
            />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}
