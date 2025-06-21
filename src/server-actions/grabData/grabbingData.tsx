"use server";

import { cookies } from "next/headers";
// import { databases } from "../../../utils/appwrite"
import { ID, Query } from "appwrite";
import { createAdminClient, createSessionClient } from "@/appwrite/config";
import conf from "@/config/envConfig";

export async function getPostCount() {
  const { account, databases } = await createSessionClient();

  console.log("we are in get posts count");

  try {
    const postCount = await databases.getDocument(
      conf.databaseId, // databaseId
      conf.collectionsCount, // collectionId
      conf.generalPostsCollectionCount, // documentId for specific collection ex: posts
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
    console.error("ERROR", error);
    return {
      error: true,
      message: "An error occurred while fetching posts liked by count.",
    };
  }
}

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
    console.error("ERROR", error);
    return {
      error: true,
      message: "An error occurred while fetching post count.",
    };
  }
}

export async function getCategoriesAndTags() {
  const { account, databases } = await createSessionClient();
  //   console.log("Account:", account);
  //     console.log("Databases:", databases);

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: categoriesAndTags } = await databases.listDocuments(
      conf.databaseId,
      conf.categoriesCollectionId,
    );

    return categoriesAndTags as CategoriesAndTagsType[];
    // const convertFromModelDocumentTypeToArray: string[] = categoriesAndTags.map(
    //   (doc) => doc.content,
    // );
    // return convertFromModelDocumentTypeToArray;
  } catch (error) {
    console.error(
      "An error occurred while fetching categories and tags",
      error,
    );
    return [];
  }
}

//   try {
//     const categoriesAndTagsData = await axios.get(
//       `${conf.baseFetchUrl}/api/categories-with-tags`,
//     );
//     const { categoriesAndTags } = categoriesAndTagsData.data;
//     return categoriesAndTags;
//   } catch (error) {
//     if (error.cause instanceof AggregateError) {
//       console.error(e.cause.errors);
//     } else {
//       console.error(
//         "Error fetching data for categories and tags  in Dashboard:",
//         error,
//       );
//     }
//     return [];
//   }
// }

export async function getTags() {
  const { account, databases } = await createSessionClient();
  //   console.log("Account:", account);
  //     console.log("Databases:", databases);
  //   const sessionCookie = cookies().get("session");

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: tagList } = await databases.listDocuments(
      conf.databaseId,
      conf.tagsCollectionId,
      [Query.limit(5000)],
    );
    //https://appwrite.io/threads/1201609088421867680
    //adding query to get all the tags, otherwise its limited to 25

    //rather than convert the data to tagType later with type casting/mapping, the data from the server is already set up with that type in mind. So convert it to that type directly from the server:
    return tagList as TagType[];
  } catch (error) {
    console.error("An error occurred while fetching tagList", error);
    return [];
  }
}
