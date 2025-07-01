import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";
import { createNewUser } from "../server-actions/createUser";
import { createAdminClient, createSessionClient } from "@/lib/appwrite/config";

export default async function getUser() {
  console.log("get User ran");
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
