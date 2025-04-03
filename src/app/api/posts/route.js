import { createSessionClient } from "@/appwrite/config";

import { Query } from "appwrite";
import conf from "@/config/envConfig";

export async function GET(request) {
  const { account, databases } = await createSessionClient();

  console.log(
    `this is request in more posts function ${request} ${JSON.stringify(
      request.params,
    )}`,
  );

  //   const sessionCookie = cookies().get("session");

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data

    // ***** page1.documents[page1.documents.length - 1].$id;

    const { documents: posts } = await databases.listDocuments(
      conf.databaseId,
      conf.postsCollectionId,
      [Query.orderAsc("$createdAt"), Query.limit(2), Query.cursorAfter(lastId)],
    );
    return Response.json({ posts });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured!",
    });
  }
}

// try {
//   //needed documents: response to get the documents back
//   // const {response} just resulted in empty data
//   const { documents: posts } = await databases.listDocuments(
//     conf.databaseId,
//     conf.postsCollectionId,
//     [Query.orderAsc("$createdAt"), Query.limit(5000)],
//   );
//   return Response.json({ posts });
// } catch (error) {
//   console.error("ERROR", error);
//   return Response.json("error", {
//     message: "An error occured!",
//   });
