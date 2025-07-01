import { createSessionClient } from "@/lib/appwrite/config";
import { ID, Query } from "appwrite";
import conf from "@/config/envConfig";
import { NextRequest } from "next/server";

export default async function getPosts(
  request: NextRequest,
  apiLinkType: string,
) {
  const { account, databases } = await createSessionClient();

  const searchParams = request.nextUrl.searchParams;

  const currentUsersId = searchParams.get("currentUsersId");

  const rawLastId = searchParams.get("lastId");

  if (typeof rawLastId !== "string") {
    //if we get null instead of a string value of "null" or "243234234" then an error happened
    // the last id is vital information we need to get the right data since we're using cursor based paginaton
    return Response.json({
      error:
        "an error occured, the lastId in the search params was a null value not 'null' or an id string",
      message: "An error occured!",
    });
  }

  const sortingValue = searchParams.get("sortingValue");

  const sortingProperty = searchParams.get("sortingProperty");

  function ConvertStringToIntOrNull(rawStringData: string) {
    return rawStringData === "null" ? null : rawStringData;
  }

  const lastId = ConvertStringToIntOrNull(rawLastId);

  const queries = [];

  //###### GENERAL POSTS: ALL OF THEM #########
  if (apiLinkType === "generalPostsAll") {
    queries.push(Query.limit(5));
  }
  //###### GENERAL POSTS: THAT THIS USER SUBMITTED #########
  else if (apiLinkType === "generalPostUserSubmitted") {
    queries.push(
      Query.equal("shared_by_user", [String(currentUsersId)]),
      Query.limit(5),
    );
  }
  //###### GENERAL POSTS: THAT THIS USER LIKED #########
  else if (apiLinkType === "generalPostUserLiked") {
    queries.push(
      Query.contains("liked_by_users", [String(currentUsersId)]),
      Query.limit(5),
    );
  }

  //if its null we're on the first swr page
  // otherwise since we're useing cursor based pagination, our next page is based on the last id of the previous page
  if (lastId !== null) {
    queries.push(Query.cursorAfter(lastId));
  }

  //##### IF THEY WANT TO SORT BY CREATION DATE ########
  if (sortingProperty === "createdAt") {
    if (sortingValue === "newest") {
      queries.push(Query.orderDesc("$createdAt"));
    } else {
      queries.push(Query.orderAsc("$createdAt"));
    }
  }

  //##### IF THEY WANT TO SORT BY LIKES ########

  if (sortingProperty === "likedByLength") {
    if (sortingValue === "mostLiked") {
      queries.push(Query.orderDesc("liked_by_users_length"));
    } else {
      queries.push(Query.orderAsc("liked_by_users_length"));
    }
  }

  try {
    const { documents: posts } = await databases.listDocuments(
      conf.databaseId,
      conf.postsCollectionId,
      queries,
    );
    return Response.json(posts);
  } catch (error) {
    console.error("ERROR", error);
    return Response.json({
      error: "an error occured",
      message: "An error occured!",
    });
  }
}
