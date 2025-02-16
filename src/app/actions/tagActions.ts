import { databases } from "@/utils/appwrite";

export async function getTags() {
  //this time we'll get getting an array of postss
  const response = await databases.listDocuments(
    `${process.env.appwrite_database_id}`,
    `${process.env.appwrite_collections_tags_id}`,
  );
  console.log(`this is from get tags ${JSON.stringify(response.documents)}`);

  //  https://www.youtube.com/watch?v=WpkfDrHADQw&list=PL4cUxeGkcC9gXxY0nrh9N4CYHtwnoHjV2&index=4 2:40
  const tags = response.documents;
  //   const posts: Post[] = response.documents.map((doc) => ({
  //     $id: doc.$id,
  //     $createdAt: doc.$createdAt,
  //     content: doc.content,
  //   }));

  return tags;
}
