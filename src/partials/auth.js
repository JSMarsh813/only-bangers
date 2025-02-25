"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";
import { createNewUser } from "../actions/createUser";
import { createAdminClient, createSessionClient } from "../appwrite/config";

export async function getUser() {
  console.log("get User ran")
  let auth = {};
  const cookieStore = await cookies();
  auth.sessionCookie = cookieStore.get("session");
  // console.log(`this is auth session cookieStore ${ JSON.stringify(auth.sessionCookie)}`)
  try {
    const { account } = await createSessionClient(auth.sessionCookie.value);
    auth.user = await account.get();
    // console.log(`this is auth user ${JSON.stringify(auth.user)}`)
  } catch {
    auth.user = null;
    auth.sessionCookie = null;
  }
  return auth.user;
}

export async function createSession(formData) {
  "use server";

  const data = Object.fromEntries(formData);
  const { email, password } = data;

  //sessionclient can't create a session, we instead have to use createAdminClient which has an api key with a lot of permissions, including making sessions

  const { account } = await createAdminClient();

  const session = await account.createEmailPasswordSession(email, password);
  //then once that session is made with createAdminClient, we set that session in the clients cookies
  const cookieStore = await cookies();
  cookieStore.set("session", session.secret, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    expires: new Date(session.expire),
    path: "/",
  });
  //then we want to redirect the user once they're logged in
  redirect("/dashboard");
}

export async function signUpWithEmail(formData) {
  "use server";
  const data = Object.fromEntries(formData);
  const { email, password, name } = data;

  try {
    const { account } = await createAdminClient();
    //createAdminClient has the permissions to create a new account
    const newUsersId = ID.unique();

    await account.create(newUsersId, email, password, name);
    const session = await account.createEmailPasswordSession(email, password);

    const cookieStore = await cookies();
    cookieStore.set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });
  } catch (error) {
    console.log(`an error occurred ${JSON.stringify(error)}`);
  }
  createNewUser(name);
  redirect("/dashboard");

  // a document in the user collection with the same id

  //then once that session is made with createAdminClient, we set that session in the clients cookies

  //error: Error: Route "/signup" used `cookies().set('my-custom-session', ...)`. `cookies()` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis

  //then we want to redirect the user once they're logged in
}

export async function deleteSession() {
  "use server";
  let auth = {};
  try {
    const cookieStore = await cookies();
    auth.sessionCookie = cookieStore.get("session");
    const { account } = await createSessionClient(auth.sessionCookie.value);
    await account.deleteSession("current");
    const waitForCookies = await cookies();
    waitForCookies.delete("session");
    auth.user = null;
    auth.sessionCookie = null;
  } catch (error) {
    console.log(`an error occurred ${JSON.stringify(error)}`);
  }
}

//although I liked how dennis ivy wrapped it in an auth object, I kept getting this error when i tried to call delete session in a client component
////https://www.youtube.com/watch?v=ENnG7GusuO4
//https://github.com/divanov11/Nextjs-Appwrite-Auth-SSR/blob/main/src/auth.js
// Error:
// It is not allowed to define inline "use server" annotated Server Actions in Client Components.
// To use Server Actions in a Client Component, you can either export them from a separate file with "use server" at the top, or pass them down through props from a Server Component.
//
//  ./src/partials.auth.js
//
// Ecmascript file had an error
//   81 |
//   82 |   deleteSession: async () => {
// > 83 |     "use server";
//      |     ^^^^^^^^^^^^
//   84 |     const cookieStore = await cookies();
//   85 |     auth.sessionCookie = cookieStore.get("session");
//   86 |     try {

// Read more: https://nextjs.org/docs/app/api-reference/functions/server-actions#with-client-components

//However I couldn't declare the entire file as "use server" on top because of this : A "use server" file can only export async functions, found object"

//so to make deletesession callable within that client component (navbar), I remove the object structure so its now a server component
