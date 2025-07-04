import { cookies } from "next/headers";
// import { databases } from "../../../utils/appwrite"
import { ID, Query } from "appwrite";
import { createSessionClient } from "@/lib/appwrite/config";
import conf from "@/config/envConfig";

export async function GET(request: Request) {
  const { account, databases } = await createSessionClient();
  //   const sessionCookie = cookies().get("session");

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: tagList } = await databases.listDocuments(
      conf.databaseId,
      conf.tagsCollectionId,
      [Query.limit(5000)],
    );
    //https://appwrite.io/threads/1201609088421867680
    //adding query to get all the tags, otherwise its limited to 25

    return Response.json(tagList);
  } catch (error) {
    console.error("ERROR", error);
    return Response.json({ error: "error", message: "An error occured!" });
  }
}
