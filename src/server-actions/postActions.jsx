"use server";

// import { databases } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { ID, Permission, Role } from "node-appwrite";
import { createSessionClient } from "@/appwrite/config";
import conf from "@/config/envConfig";
import { revalidatePath } from "next/cache";

export async function addPost(state, dataFromUseActionState) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  let check = await dataFromUseActionState;
  let data = "";
  data = Object.fromEntries(dataFromUseActionState);

  const { account, databases } = await createSessionClient(session.value);
  const usersAccount = await account.get();

  let {
    check_sharing_okay,
    resource_url,
    start_time_hours,
    start_time_minutes,
    start_time_seconds,
    summary,
    quote,
    shared_by_user,
    content_type,
    tags,
  } = data;
  if (check_sharing_okay === "true") {
    check_sharing_okay = true;
  } else {
    check_sharing_okay = false;
  }

  tags = tags.split(",");
  console.log(`this is content_type ${content_type}`);

  // https://appwrite.io/threads/1129238566019551292
  const response = await databases.createDocument(
    conf.databaseId,
    conf.postsCollectionId,
    ID.unique(),
    {
      check_sharing_okay: check_sharing_okay,
      resource_url: resource_url,
      start_time_hours: parseInt(start_time_hours),
      start_time_minutes: parseInt(start_time_minutes),
      start_time_seconds: parseInt(start_time_seconds),
      summary: summary,
      quote: quote,
      shared_by_user: shared_by_user,
      content_type: content_type,
      tags: tags,
    },
    [
      Permission.read(Role.any()), // Anyone can view this document
      Permission.delete(Role.user(usersAccount.$id)), // This user can delete this document
      Permission.update(Role.user(usersAccount.$id)), // This user can edit this document
    ],
  );
  revalidatePath("/");
  return response;
}

export async function updatePost(postId, data) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  const { account, databases } = await createSessionClient(session.value);

  const response = await databases.updateDocument(
    conf.databaseId,
    conf.postsCollectionId,
    postId,
    data,
  );
  revalidatePath("/");
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
  );
  revalidatePath("/");
  return response;
}
