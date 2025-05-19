import { createSessionClient } from "@/appwrite/config";
import { ID, Query } from "appwrite";
import conf from "@/config/envConfig";

export default async function grabbingPostData(request, apiLinkType) {
  const { account, databases } = await createSessionClient();

  const searchParams = request.nextUrl.searchParams;

  function ConvertStringToIntOrNull(rawStringData) {
    return rawStringData === "null" ? null : rawStringData;
  }

  const currentUsersId = searchParams.get("currentUsersId");
  const rawLastId = searchParams.get("lastId");
  const lastId = ConvertStringToIntOrNull(rawLastId);

  const sortingValue = searchParams.get("sortingValue");
  const sortingProperty = searchParams.get("sortingProperty");

  let queries = [];
  if (apiLinkType === "generalPostsAll") {
    queries.push(Query.limit(120));
  } else if (apiLinkType === "generalPostUserSubmitted") {
    queries.push(
      Query.equal("shared_by_user", [String(currentUsersId)]),
      Query.limit(5),
    );
  } else if (apiLinkType === "generalPostUserLiked") {
    queries.push(
      Query.contains("liked_by_users", [String(currentUsersId)]),
      Query.limit(5),
    );
  }

  if (lastId !== null) {
    queries.push(Query.cursorAfter(lastId));
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
    const { documents: posts } = await databases.listDocuments(
      conf.databaseId,
      conf.postsCollectionId,
      queries,
    );
    return Response.json(posts);
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured!",
    });
  }
}
