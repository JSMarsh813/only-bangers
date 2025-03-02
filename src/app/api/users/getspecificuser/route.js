import { cookies } from "next/headers";
// import { databases } from "../../../utils/appwrite";

import { createSessionClient } from "@/appwrite/config";
import trimAppwriteDocument from "../../../../utils/trimAppwriteDocument";
import { ID, Query } from "appwrite";
import conf from "@/config/envConfig";

export async function POST(request, response) {
  const { account, databases } = await createSessionClient();

  //   const sessionCookie = cookies().get("session");

  try {
    const body = await request.json();
    let currentUsersId = body.usersId;

    // console.log(`this is body ${JSON.stringify(currentUsersId)}`);

    const currentTargetedId = String(currentUsersId);
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    // console.log("get specific user reached");
    const result = await databases.getDocument(
      conf.databaseId,
      conf.usersCollectionId,
      currentTargetedId,
      [Query.select(["$id", "user_name", "profile_image"])],
    );

    let trimmedUserObject = trimAppwriteDocument(result);

    return Response.json({ trimmedUserObject });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured!",
    });
  }
}
