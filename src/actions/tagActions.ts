"use server";

// import { databases } from "@/utils/appwrite";

import { createSessionClient } from "@/appwrite/config";
import conf from "../config/envConfig";
const { account, databases } = await createSessionClient();

export async function getTags() {
  //this time we'll get getting an array of postss
  const response = await databases.listDocuments(
    conf.databaseId,
    conf.tagsCollectionId,
  );
  // console.log(`this is from get tags ${JSON.stringify(response.documents)}`);

  //  https://www.youtube.com/watch?v=WpkfDrHADQw&list=PL4cUxeGkcC9gXxY0nrh9N4CYHtwnoHjV2&index=4 2:40
  const tags = response.documents;
  //   const posts: Post[] = response.documents.map((doc) => ({
  //     $id: doc.$id,
  //     $createdAt: doc.$createdAt,
  //     content: doc.content,
  //   }));

  return tags;
}
