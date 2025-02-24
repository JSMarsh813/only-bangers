import { cookies } from "next/headers";
// import { databases } from "../../../utils/appwrite";

import { createSessionClient } from "@/appwrite/config";

import { ID, Query } from "appwrite";
import conf from "@/config/envConfig";

export async function GET(request) {
  const { account, databases } = await createSessionClient();

  //   const sessionCookie = cookies().get("session");

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: posts } = await databases.listDocuments(
      conf.databaseId,
      conf.postsCollectionId,
      [Query.orderAsc("$createdAt"), Query.limit(5000)],
    );
    return Response.json({ posts });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured!",
    });
  }
}
