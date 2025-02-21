import { createSessionClient } from "@/appwrite/config";
import { cookies } from "next/headers";
import { databases } from "../../../utils/appwrite";
import { ID, Query } from "appwrite";
import conf from "@/config/config"

export async function GET(request) {
  //   const sessionCookie = cookies().get("session");

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: posts } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_POSTS,
      [Query.orderAsc('$createdAt'),
        Query.limit(5000)
      ]
    );
    return Response.json({ posts });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured!",
    });
  }
}
