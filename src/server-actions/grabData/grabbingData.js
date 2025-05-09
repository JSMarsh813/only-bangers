"use server";

import { cookies } from "next/headers";
// import { databases } from "../../../utils/appwrite"
import { ID, Query } from "appwrite";
import { createAdminClient, createSessionClient } from "@/appwrite/config";
import conf from "@/config/envConfig";

export async function getPostCount() {
  //tags will not change so we are caching it

  const { account, databases } = await createSessionClient();
  //   console.log("Account:", account);
  //     console.log("Databases:", databases);

  //   const body = await request.json();
  // console.log(body);
  //{ usersId: '67c81d310034f8b059f1' }
  //   let currentUsersId = body.usersId;
  //67c81d310034f8b059f1
  // console.log(`${currentUsersId}`);
  console.log("we are in get posts count");

  try {
    const postCount = await databases.getDocument(
      conf.databaseId, // databaseId
      conf.collectionsCount, // collectionId
      "68169d220030c4571141", // documentId for specific collection ex: posts
    );

    return postCount.count;
  } catch (error) {
    console.error("ERROR", error);
    return {
      error: true,
      message: "An error occurred while fetching post count.",
    };
  }

  //   try {
  //     let postCountData = await axios.get(
  //       `${conf.baseFetchUrl}/api/posts/get-posts-count`,
  //     );
  //     //it gets send at a response object, so we're grabbing thh data from it that we need
  //     let { postCount } = await postCountData.data;
  //     return postCount.count;
  //   } catch (error) {
  //     if (error.cause instanceof AggregateError) {
  //       console.error(e.cause.errors);
  //     } else {
  //       console.error("Error fetching data get-posts-count on root page:", error);
  //     }
  //     return [];
  //   }
}

export async function getCategories() {
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

    return categoriesAndTags;
  } catch (error) {
    console.error("ERROR", error);
    return {
      error: true,
      message: "An error occurred while fetching categories and tags.",
    };
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

    return tagList;
  } catch (error) {
    console.error("ERROR", error);
    return {
      error: true,
      message: "An error occurred while fetching tagList.",
    };
  }
}
