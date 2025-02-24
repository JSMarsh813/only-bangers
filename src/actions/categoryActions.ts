"use server";

// import { databases } from "@/utils/appwrite";
import { createSessionClient } from "@/appwrite/config";

const { account, databases } = await createSessionClient();

export async function getCategoriesAndTags() {
  //this time we'll get getting an array of postss
  const response = await databases.listDocuments(
    `${process.env.appwrite_database_id}`,
    `${process.env.appwrite_collections_categories_id}`,
  );
  //   console.log(
  //     `this is from get categories and tags ${JSON.stringify(
  //       response.documents,
  //     )}`,
  //   );

  //  https://www.youtube.com/watch?v=WpkfDrHADQw&list=PL4cUxeGkcC9gXxY0nrh9N4CYHtwnoHjV2&index=4 2:40
  const categoriesandtags = response.documents;
  //   const posts: Post[] = response.documents.map((doc) => ({
  //     $id: doc.$id,
  //     $createdAt: doc.$createdAt,
  //     content: doc.content,
  //   }));

  return JSON.parse(JSON.stringify(categoriesandtags));
  //https://appwrite.io/threads/1195355789297205278
}
