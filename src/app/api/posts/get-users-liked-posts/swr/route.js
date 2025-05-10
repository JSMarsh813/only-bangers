import { cookies } from "next/headers";
// import { databases } from "../../../utils/appwrite";

import { createSessionClient } from "@/appwrite/config";

import { ID, Query } from "appwrite";
import conf from "@/config/envConfig";

export async function GET(request) {
  const { account, databases } = await createSessionClient();

  const searchParams = request.nextUrl.searchParams;

  function ConvertStringToIntOrNull(rawStringData) {
    return rawStringData === "null" ? null : rawStringData;
  }

  const currentUsersId = searchParams.get("currentUsersId");
  const rawLastId = searchParams.get("lastId");
  const lastId = ConvertStringToIntOrNull(rawLastId);
  console.log(`this is lastID ${lastId}`);

  const sortingValue = searchParams.get("sortingValue");
  const sortingProperty = searchParams.get("sortingProperty");

  let queries = [
    Query.contains("liked_by_users", [String(currentUsersId)]),
    Query.limit(5000),
  ];

  if (lastId !== null) {
    // console.log("if statement ran, last id != null");
    // console.log(`this is lastid in if statement ${lastId}`);
    // console.log(`this is lastid in if statement ${typeof lastId}`);
    // fetches after the first page
    queries.push(Query.cursorAfter(lastId));
    // console.log(`this is queries in if ${queries}`);
  }

  if (sortingProperty === "createdAt") {
    if (sortingValue === "newest") {
      queries.push(Query.orderDesc("$createdAt"));
    } else {
      queries.push(Query.orderAsc("$createdAt"));
    }
  }

  if (sortingProperty === "likedByLength") {
    if (sortingValue === "mostLiked") {
      queries.push(Query.orderDesc("liked_by_users_length"));
    } else {
      queries.push(Query.orderAsc("liked_by_users_length"));
    }
  }

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
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
