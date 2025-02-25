"use server";

import React from "react";
import { redirect } from "next/navigation";
import { getUser, signUpWithEmail } from "@/partials/auth";

export default async function SignUpPage() {
  //if user is already signed in, redirect to dashboard
  const user = await getUser();
  if (user) redirect("/dashboard");

  return (
    <>
      <form action={signUpWithEmail}>
        <input
          id="email"
          name="email"
          placeholder="Email"
          type="email"
        />
        <input
          id="password"
          name="password"
          placeholder="Password"
          minLength={8}
          type="password"
        />
        <input
          id="name"
          name="name"
          placeholder="Name"
          type="text"
        />
        <button type="submit">Sign up</button>
      </form>
    </>
  );
}
