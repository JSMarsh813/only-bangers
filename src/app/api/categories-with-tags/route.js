import { cookies } from "next/headers";
// import { databases } from "../../../utils/appwrite"
import { ID } from "appwrite";
import { createSessionClient } from "@/appwrite/config";
import conf from "../../../config/envConfig";

export async function GET(request) {
  const { account, databases } = await createSessionClient();

  //   const sessionCookie = cookies().get("session");

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: categoriesAndTags } = await databases.listDocuments(
      conf.databaseId,
      conf.categoriesCollectionId,
    );
    return Response.json({ categoriesAndTags });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured!",
    });
  }
}
