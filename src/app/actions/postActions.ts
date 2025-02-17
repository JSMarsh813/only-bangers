import { databases } from "@/utils/appwrite";
import { ID } from "appwrite";

export async function addPost(content: unknown): Promise<unknown> {
  //string == content: string
  // takes in an arguement called content, which should be a string

  //return value is a promise because this is an async fun
  // the return value will be a Post Object (src/types.d.ts)
  const newPost = { content: content };
  // content field, the content field is equal to the content arguement passed in
  const response = await databases.createDocument(
    `${process.env.appwrite_database_id}`,
    `${process.env.appwrite_collections_posts_id}`,
    ID.unique(),
    newPost,
  );

  //1st arg = db id as a string value
  //2nd arg= collection id as a string value
  // id for new documents, telling appwrite to generate a unique id for us
  // src/types.d.ts is where we said what the post object must have
  // object to represnt the new document we want to save
  //   const post = {
  //     $id: response.$id,
  //     $createdAt: response.$createdAt,
  //     content: response.content,
  //   };

  return `this is ${JSON.stringify(response)}`;
}

export async function getPosts() {
  //this time we'll get getting an array of posts
  const response = await databases.listDocuments(
    `${process.env.appwrite_database_id}`,
    `${process.env.appwrite_collections_posts_id}`,
  );
  // console.log(`this is from get posts ${JSON.stringify(response.documents)}`);

  //  https://www.youtube.com/watch?v=WpkfDrHADQw&list=PL4cUxeGkcC9gXxY0nrh9N4CYHtwnoHjV2&index=4 2:40
  const posts = response.documents;
  //   const posts: Post[] = response.documents.map((doc) => ({
  //     $id: doc.$id,
  //     $createdAt: doc.$createdAt,
  //     content: doc.content,
  //   }));

  return JSON.parse(JSON.stringify(posts));
  //https://appwrite.io/threads/1195355789297205278
}

export async function deletePost(postId: string) {
  await databases.deleteDocument(
    "only_bangers_db",
    //databaseid as a string
    "posts",
    //2nd arg= collection id as a string value
    postId,
    //id of document we want to delete from that collection
  );
}
