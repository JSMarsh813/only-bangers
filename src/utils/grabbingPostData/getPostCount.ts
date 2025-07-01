import { createAdminClient, createSessionClient } from "@/appwrite/config";

import conf from "../../config/envConfig";

export default async function getPostCount() {
  const { account, databases } = await createSessionClient();

  try {
    const postCount = await databases.getDocument(
      conf.databaseId,
      conf.collectionsCount,
      conf.generalPostsCollectionCount,
    );

    return postCount.count;
  } catch (error) {
    console.error("Error fetching data get-posts-count on root page:", error);
    return [];
  }
}
