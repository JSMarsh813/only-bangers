
import React from "react";
import { ID } from "node-appwrite";
import { createAdminClient } from "../../appwrite/config"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import auth from "../../partials/auth"
// import {
//   getLoggedInUser
// } from "../../appwrite"

// const SignupPage = () => {
//   const router = useRouter();
//   const { authStatus } = useAuth();

//   if (authStatus) {
//     router.replace("/profile");
//     return <></>;
//   }
// src/app/signup/page.jsx


async function signUpWithEmail(formData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  const { account } = await createAdminClient();
  //createAdminClient has the permissions to create a new account

  await account.create(ID.unique(), email, password, name);
  const session = await account.createEmailPasswordSession(email, password);

  //error: Error: Route "/signup" used `cookies().set('my-custom-session', ...)`. `cookies()` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
cookies().set("my-custom-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
 

}

export default async function SignUpPage() {
  const user = await auth.getUser();
  if (user) redirect("/account");

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
