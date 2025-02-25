"use client";
// needed to avoid the error: TypeError: (0 , _react.createContext) is not a function
//https://stackoverflow.com/questions/74255356/typeerror-react-createcontext-is-not-a-function-nextjs-13-formik-with-typesc

import React, { Children } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { deleteSession } from "../../../partials/auth";

function NavList() {
  const router = useRouter();

  //directly calling deleteSession (<form onSubmit={deletesession>)
  // results in: Uncaught (in promise) TypeError: NetworkError when attempting to fetch resource
  //putting it in the handleSignout function avoids this error

  let handleSignout = function (event) {
    event.preventDefault();
    deleteSession();
    router.push("/login");
    // Originally I did the redirect in the server logic for deletesession
    // however redirect("/login") was resulting in these errors, so i used useRouter in the signout button component instead since i tried multiple alternatives but none got rid of the error message
    //Uncaught (in promise) Error: NEXT_REDIRECT
    //Uncaught (in promise) TypeError: NetworkError when attempting to fetch resource.
  };

  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="medium"
        color="blue-gray"
        className="p-1 font-medium hover:border-x-2 hover:border-blue-200 px-4 "
      >
        <a
          href="/"
          className="flex items-center hover:text-blue-200 transition-colors"
        >
          Home
        </a>
      </Typography>

      <Typography
        as="li"
        variant="medium"
        color="blue-gray"
        className="p-1 font-medium hover:border-x-2 hover:border-blue-200 px-4 "
      >
        <a
          href="/login"
          className="flex items-center hover:text-blue-200 transition-colors"
        >
          Login
        </a>
      </Typography>

      <Typography
        as="li"
        variant="medium"
        color="blue-gray"
        className="p-1 font-medium hover:border-x-2 hover:border-blue-200 px-4 bg-blue-900 rounded-lg py-2"
      >
        <a
          href="/signup"
          className="flex items-center hover:text-blue-200 transition-colors"
        >
          Sign Up
        </a>
      </Typography>
      <Typography
        as="li"
        variant="medium"
        color="blue-gray"
        className="p-1 font-medium hover:border-x-2 hover:border-blue-200 px-4 bg-blue-900 rounded-lg py-2"
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
    <Navbar className="rounded-none mx-auto px-6 py-3 text-white text-3xl  bg-100devs">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="/"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 text-2xl"
        >
          Only Bangers
        </Typography>
        <div className="hidden lg:block">
          <NavList />
        </div>
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
