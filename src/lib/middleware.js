//middleware MUST be in the root of the project to work

import { NextResponse } from "next/server";
import { getUser } from "../server-actions/auth";

//Redirects anyone whose not signed in away from the dashboard to the login page
export async function middleware(request) {
  const user = await getUser();

  // console.log("middleware ran");
  if (!user) {
    //if something doesn't work out when getting the user, i want to delete the session to make sure the faulty session doesn't linger there
    request.cookies.delete("session");
    const response = NextResponse.redirect(new URL("/login", request.url));

    return response;
  }
  return NextResponse.next();
}

// this makes it so the middleware doesn't run on every page
//instead it only runs on the dashboard
//https://www.youtube.com/watch?v=ENnG7GusuO4&t=1522s

export const config = {
  matcher: ["/dashboard"],
};
