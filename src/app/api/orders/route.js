import { createSessionClient } from "@/appwrite/config";
import { cookies } from "next/headers";

export async function GET(request) {
  // checking for a session cookie
  const sessionCookie = cookies().get("session");

  try {
    //don't need to check for a user
    // the user would of been authenticated with createSessionClient in src\appwrite\config.js
    //if we don't have a session cookie or an error happens, the catch runs
    const { databases } = await createSessionClient(sessionCookie.value);

    const { documents: orders, total } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS,
    );

    return Response.json({ orders, total });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("Access DENIED!", {
      status: 403,
    });
  }
}
