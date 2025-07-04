//middleware MUST be in the root of the project to work
//If its placed in lib, Next.js will not detect or run it

import { NextResponse, NextRequest } from "next/server";
import getSignedInUser from "./src/lib/getSignedInUser";

//Redirects anyone whose not signed in away from the dashboard to the login page

//Middleware executes before routes are rendered. It's particularly useful for implementing custom server-side logic like authentication, logging, or handling redirects.
export async function middleware(request: NextRequest) {
  const user = await getSignedInUser();

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
