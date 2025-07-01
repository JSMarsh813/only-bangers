import { createSessionClient } from "@/lib/appwrite/config";

import { Query } from "appwrite";
import conf from "@/config/envConfig";

export async function POST(request) {
  const { account, databases } = await createSessionClient();

  const { pageNumber, notFirstPage, lastId } = await request.json();

  //DOCUMENTS_PER_PAGE

  let queries = [Query.limit(2)];
  //   const sessionCookie = cookies().get("session");

  console.log(`this is lastid ${lastId}`);

  if ((notFirstPage === true && lastId != 0) || lastId != null) {
    console.log(`this is lastid ${lastId}`);
    // fetches after the first
    queries.push(Query.cursorAfter(lastId));
  }

  if (notFirstPage === true && (lastId == null || lastId == 0)) {
    console.log("an error occured");
    return Response.json("error", {
      message: "Invalid lastId provided for posts after the first page!",
    });
  }

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data

    // ***** page1.documents[page1.documents.length - 1].$id;

    const { documents: posts } = await databases.listDocuments(
      conf.databaseId,
      conf.postsCollectionId,
      queries,
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
