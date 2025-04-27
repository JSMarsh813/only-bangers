import { createSessionClient } from "@/appwrite/config";
import { NextRequest } from "next/server";
import { Query } from "appwrite";
import conf from "@/config/envConfig";

export async function GET(request, response) {
  //https://javascript.plainenglish.io/next-js-15-tutorial-part-31-query-parameters-headers-made-easy-27d558e085eb

  const searchParams = request.nextUrl.searchParams;
  console.log(`this is search params ${searchParams}`);
  // const pageNumber = searchParams.get("pageNumber");
  // console.log(`this is PageNumber ${pageNumber}`);
  const lastId = searchParams.get("lastId");
  console.log(`this is lastid ${lastId}`);

  const itemsPerPage = searchParams.get("itemsPerPage");
  const sortingValue = searchParams.get("sortingValue");
  const sortingProperty = searchParams.get("sortingProperty");

  const { account, databases } = await createSessionClient();

  // const { pageNumber, notFirstPage, lastId } = request.query;
  //https://stackoverflow.com/questions/70751313/how-can-i-pass-a-variable-in-sort-funtcion-of-mongobd

  // let sortlogic = {};
  // sortlogic[sortingproperty] = parseInt(sortingvalue);

  //DOCUMENTS_PER_PAGE

  //   const sessionCookie = cookies().get("session");

  // if (lastId == "null") {
  //   console.log("an error occured");
  //   return Response.json("error", {
  //     message: "Invalid lastId provided for posts after the first page!",
  //   });
  // }

  let queries = [Query.limit(itemsPerPage * 2)];

  if (lastId != "null") {
    console.log("if statement ran, last id != null");
    console.log(`this is lastid in if statement ${lastId}`);
    // fetches after the first page
    queries.push(Query.cursorAfter(lastId));
    console.log(`this is queries in if ${queries}`);
  }

  if (sortingProperty == "createdAt") {
    if (sortingValue == "newest") {
      queries.push(Query.orderDesc("$createdAt"));
    } else {
      queries.push(Query.orderAsc("$createdAt"));
    }
  }

  // else {
  //   console.log(`else statement ran, last item is null ${lastId}`);
  // }

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
