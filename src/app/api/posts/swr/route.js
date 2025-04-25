import { createSessionClient } from "@/appwrite/config";
import { NextRequest } from "next/server";
import { Query } from "appwrite";
import conf from "@/config/envConfig";

export async function GET(request, response) {
  //https://javascript.plainenglish.io/next-js-15-tutorial-part-31-query-parameters-headers-made-easy-27d558e085eb

  const searchParams = request.nextUrl.searchParams;
  console.log(`this is search params ${searchParams}`);
  const pageNumber = searchParams.get("pageNumber") || -1;
  console.log(`this is PageNumber ${pageNumber}`);
  const lastId = searchParams.get("lastId") || null;
  const isFirstPageOfData = searchParams.get("isFirstPageOfData");
  const { account, databases } = await createSessionClient();

  // const { pageNumber, notFirstPage, lastId } = request.query;
  //https://stackoverflow.com/questions/70751313/how-can-i-pass-a-variable-in-sort-funtcion-of-mongobd

  // let sortlogic = {};
  // sortlogic[sortingproperty] = parseInt(sortingvalue);

  //DOCUMENTS_PER_PAGE

  //   const sessionCookie = cookies().get("session");

  console.log(`this is lastid ${lastId}`);
  console.log(`this is isFirstPageOfData ${typeof isFirstPageOfData}`);
  console.log(
    `this is isFirstPageOfData is false ${isFirstPageOfData === "false"}`,
  );
  if (isFirstPageOfData === "false" && (lastId == null || lastId == 0)) {
    console.log("an error occured");
    return Response.json("error", {
      message: "Invalid lastId provided for posts after the first page!",
    });
  }

  let queries = [Query.limit(2)];
  if (isFirstPageOfData === "false") {
    console.log("if statement ran");
    console.log(`this is lastid ${lastId}`);
    // fetches after the first page
    queries.push(Query.cursorAfter(lastId));
    console.log(`this is queries in if ${queries}`);
  } else {
    console.log("else statement ran");
  }

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data

    // ***** page1.documents[page1.documents.length - 1].$id;

    console.log(`this is queries ${JSON.stringify(queries)}`);

    const { documents: posts } = await databases.listDocuments(
      conf.databaseId,
      conf.postsCollectionId,
      queries,
    );
    console.log(`this is posts ${JSON.stringify(posts)}`);
    return Response.json(posts);
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
