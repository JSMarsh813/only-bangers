import { cookies } from "next/headers";
// import { databases } from "../../../utils/appwrite"
import { ID, Query } from "appwrite";
import { createSessionClient } from "@/appwrite/config";

export async function GET(request) {
  const { account, databases } = await createSessionClient();
  //   const sessionCookie = cookies().get("session");

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: tagList } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_TAGS,
      [Query.limit(5000)],
    );
    //https://appwrite.io/threads/1201609088421867680
    //adding query to get all the tags, otherwise its limited to 25

    return Response.json({ tagList });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured!",
    });
  }
}
