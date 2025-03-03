"use server";

// import { databases } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { ID, Permission, Role } from "node-appwrite";
import { createSessionClient } from "@/appwrite/config";
import conf from "@/config/envConfig";

export async function addPost(postSubmission) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  const { account, databases } = await createSessionClient(session.value);
  const usersAccount = await account.get();

  // https://appwrite.io/threads/1129238566019551292
  const response = await databases.createDocument(
    conf.databaseId,
    conf.postsCollectionId,
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
}

export async function deletePost(postId) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  const { account, databases } = await createSessionClient(session.value);

  const response = await databases.deleteDocument(
    conf.databaseId,
    conf.postsCollectionId,
    postId,
    //id of document we want to delete from that collection
  );
  return response;
}
