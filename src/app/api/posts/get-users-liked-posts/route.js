import { cookies } from "next/headers";
// import { databases } from "../../../utils/appwrite";

import { createSessionClient } from "@/appwrite/config";

import { ID, Query } from "appwrite";
import conf from "@/config/envConfig";

export async function POST(request) {
  const { account, databases } = await createSessionClient();

  const body = await request.json();
  console.log(body);
  //{ usersId: '67c81d310034f8b059f1' }
  let currentUsersId = body.usersId;
  //67c81d310034f8b059f1
  console.log(`${currentUsersId}`);

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: posts } = await databases.listDocuments(
      conf.databaseId,
      conf.postsCollectionId,
      [
        Query.contains("liked_by_users", [String(currentUsersId)]),
        Query.limit(5000),
      ],
    );
    return Response.json({ posts });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured!",
    });
  }
}
