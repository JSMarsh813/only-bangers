"use server";

// import { databases } from "@/utils/appwrite";
import { createSessionClient } from "@/appwrite/config";
import conf from "../config/envConfig";
const { account, databases } = await createSessionClient();

export async function getCategoriesAndTags() {
  //this time we'll get getting an array of postss
  const response = await databases.listDocuments(
    conf.databaseId,
    conf.categoriesCollectionId,
  );
  //  https://www.youtube.com/watch?v=WpkfDrHADQw&list=PL4cUxeGkcC9gXxY0nrh9N4CYHtwnoHjV2&index=4 2:40
  const categoriesandtags = response.documents;

  return JSON.parse(JSON.stringify(categoriesandtags));
  //https://appwrite.io/threads/1195355789297205278
}
