// import { databases } from "../../../utils/appwrite"
import { ID, Query } from "appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite/config";
import conf from "@/config/envConfig";

//############# Get the amount of posts in the general category ##########
export async function getPostCount() {
  const { account, databases } = await createSessionClient();

  try {
    const postCount = await databases.getDocument(
      conf.databaseId,
      conf.collectionsCount,
      conf.generalPostsCollectionCount,
    );

    return postCount.count;
  } catch (error) {
    console.error("ERROR", error);
    return {
      error: true,
      message: "An error occurred while fetching post count.",
    };
  }
}

//############# Get the amount of general posts a specific user has submitted ##########

export async function getUsersSubmittedGeneralPostsCount(
  currentUsersId: string | number,
) {
  const { account, databases } = await createSessionClient();

  console.log("we are in get posts count");

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: posts } = await databases.listDocuments(
      conf.databaseId,
      conf.postsCollectionId,
      [
        Query.equal("shared_by_user", [String(currentUsersId)]),
        Query.limit(5000),
      ],
    );

    return posts.length;
  } catch (error) {
    console.error(
      "An error occurred while fetching posts liked by count",
      error,
    );
    return {
      error: true,
      message: "An error occurred",
    };
  }
}

//############# Get the amount of general posts a specific user has liked ##########

export async function getUsersLikedByGeneralPostsCount(
  currentUsersId: string | number,
) {
  const { account, databases } = await createSessionClient();

  console.log("we are in get posts count");

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: posts } = await databases.listDocuments(
      conf.databaseId,
      conf.postsCollectionId,
      [
        Query.contains("liked_by_users", [String(currentUsersId)]),
        Query.limit(5000),
      ],
    );

    return posts.length;
  } catch (error) {
    console.error("An error occurred while fetching post count.", error);
    return {
      error: true,
      message: "An error occurred",
    };
  }
}
