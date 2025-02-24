"use server";

// import { databases } from "@/utils/appwrite";
import { ID } from "appwrite";
import { createSessionClient } from "@/appwrite/config";

export async function addPost(postSubmission) {
  const { account, databases } = await createSessionClient();
  //string == content: string
  // takes in an arguement called content, which should be a string

  //return value is a promise because this is an async fun
  // the return value will be a Post Object (src/types.d.ts)
  // const newPost = { ...postSubmission };
  // content field, the content field is equal to the content arguement passed in
  console.log(JSON.stringify(postSubmission));

  //Error in ID.unique()

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
      tags: postSubmission.tagsToSubmit,
    },
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
  await databases.deleteDocument(
    `67b10c21001fa74929be`,
    `67b10c6c00026c7e5e26`,
    postId,
    //id of document we want to delete from that collection
  );
}

// export async function filteringPosts() {
//   await databases.listDocuments(
//     `67b10c21001fa74929be`,
//     `67b10c6c00026c7e5e26`,
//     [Query.contains("tags", ["67b23e470005b51b59d6"])],
//   );
// }
