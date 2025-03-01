"use server";

// import { databases } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { ID, Permission, Role } from "node-appwrite";
import { createSessionClient } from "@/appwrite/config";

export async function addPost(postSubmission) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  const { account, databases } = await createSessionClient(session.value);
  const usersAccount = await account.get();

  //string == content: string
  // takes in an arguement called content, which should be a string

  //return value is a promise because this is an async fun
  // the return value will be a Post Object (src/types.d.ts)
  // const newPost = { ...postSubmission };
  // content field, the content field is equal to the content arguement passed in
  console.log(JSON.stringify(postSubmission));

  //Error in ID.unique()

  console.log(postSubmission);

  // https://appwrite.io/threads/1129238566019551292
  const response = await databases.createDocument(
    `67b10c21001fa74929be`,
    `67b10c6c00026c7e5e26`,
    ID.unique(),
    {
      check_sharing_okay: postSubmission.check_sharing_okay,
      link: postSubmission.link,
      start_time_hours: postSubmission.start_time_hours,
      start_time_minutes: postSubmission.start_time_minutes,
      start_time_seconds: postSubmission.start_time_seconds,

      end_time_hours: postSubmission.end_time_hours,
      end_time_seconds: postSubmission.end_time_seconds,
      end_time_minutes: postSubmission.end_time_minutes,

      summary: postSubmission.summary,
      quote: postSubmission.quote,
      shared_by_user: postSubmission.shared_by_user,
      category_type: postSubmission.category_type,
      tags: postSubmission.tags,
    },
    [
      Permission.read(Role.any()), // Anyone can view this document
      Permission.delete(Role.user(usersAccount.$id)), // This user can delete this document
      Permission.update(Role.user(usersAccount.$id)), // This user can edit this document
    ],
  );

  return response;

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
}

// export async function getPosts() {
//   //this time we'll get getting an array of posts
//   const response = await databases.listDocuments(
//     `67b10c21001fa74929be`,
//     `67b10c6c00026c7e5e26`,
//   );
//   // console.log(`this is from get posts ${JSON.stringify(response.documents)}`);

//   //  https://www.youtube.com/watch?v=WpkfDrHADQw&list=PL4cUxeGkcC9gXxY0nrh9N4CYHtwnoHjV2&index=4 2:40
//   const posts = response.documents;
//   //   const posts: Post[] = response.documents.map((doc) => ({
//   //     $id: doc.$id,
//   //     $createdAt: doc.$createdAt,
//   //     content: doc.content,
//   //   }));

//   return JSON.parse(JSON.stringify(posts));
//   //https://appwrite.io/threads/1195355789297205278
// }

export async function deletePost(postId) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  const { account, databases } = await createSessionClient(session.value);

  const response = await databases.deleteDocument(
    `67b10c21001fa74929be`,
    `67b10c6c00026c7e5e26`,
    postId,
    //id of document we want to delete from that collection
  );
  return response;
}
