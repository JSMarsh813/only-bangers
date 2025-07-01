import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";
import { createNewUser } from "../server-actions/createUser";
import { createAdminClient, createSessionClient } from "@/lib/appwrite/config";
import { Account, Models } from "appwrite";

export default async function getUser(): Promise<Models.User<Models.Preferences> | null> {
  console.log("get User ran");

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  // console.log(`this is auth session cookieStore ${ JSON.stringify(auth.sessionCookie)}`)
  const cookieValue = sessionCookie?.value;

  let user: Models.User<Models.Preferences> | null = null;

  try {
    if (!cookieValue) {
      console.log("No session cookie found.");
      return null;
    }
    const { account } = await createSessionClient(sessionCookie.value);
    user = await account.get();
    // console.log(`this is auth user ${JSON.stringify(auth.user)}`)
  } catch {
    user = null;
    console.log(
      `user account was not found, there ${
        cookieValue ? "was" : "wasn't"
      } a session cookie value`,
    );
  }
  return user;
}
