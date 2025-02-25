"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";
import { createNewUser } from "../actions/createUser";
import { createAdminClient, createSessionClient } from "../appwrite/config";

//can't have "use server" on top because of this : A "use server" file can only export async functions, found object"

export async function getUser() {
  let auth = {};
  const cookieStore = await cookies();
  auth.sessionCookie = cookieStore.get("session");
  try {
    const { account } = await createSessionClient(auth.sessionCookie.value);
    auth.user = await account.get();
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

  // redirect("/login") was resulting in these errors, so i used useRouter in the signout button component instead
  //Uncaught (in promise) Error: NEXT_REDIRECT
  //Uncaught (in promise) TypeError: NetworkError when attempting to fetch resource.
  //https://stackoverflow.com/questions/76191324/next-13-4-error-next-redirect-in-api-routes
}
