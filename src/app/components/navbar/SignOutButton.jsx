import React from "react";
import { deleteSession } from "../../../partials/auth";

export default function SignOutButton() {
  let handleSignout = function (event) {
    event.preventDefault();
    deleteSession();
  };
  return (
    <form onSubmit={handleSignout}>
      <button
        className="flex items-center hover:text-blue-200 transition-colors"
        type="submit"
      >
        Logout
      </button>
    </form>
  );
}

// ./src/partials.auth.js
//
// Ecmascript file had an error
//   81 |
//   82 |   deleteSession: async () => {
// > 83 |     "use server";
//      |     ^^^^^^^^^^^^
//   84 |     const cookieStore = await cookies();
//   85 |     auth.sessionCookie = cookieStore.get("session");
//   86 |     try {

// It is not allowed to define inline "use server" annotated Server Actions in Client Components.
// To use Server Actions in a Client Component, you can either export them from a separate file with "use server" at the top, or pass them down through props from a Server Component.

// Read more: https://nextjs.org/docs/app/api-reference/functions/server-actions#with-client-components
