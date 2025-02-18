const { NextResponse } = require("next/server");
// import auth from "./auth";

//Redirects anyone whose not signed in away from the dashboard to the login page
export async function middleware(request) {
  // const user = await auth.getUser();
  const user = true;
  if (!user) {
    // request.cookies.delete("session");
    const response = NextResponse.redirect(new URL("/login", request.url));

    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
