"use server";

// import { databases } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { ID, Permission, Role } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/appwrite/config";
import conf from "@/config/envConfig";
import { revalidatePath } from "next/cache";
import checkifUrlIsEmbedded from "../utils/checkIfUrlWillLoad";

async function updatePostCount(action) {
  // then update post count in count collections
  try {
    const { account, databases } = await createAdminClient();

    const postCollectionCount = await databases.getDocument(
      conf.databaseId, // databaseId
      conf.collectionsCount, // collectionId
      conf.generalPostsCollectionCount, // documentId for specific collection ex: posts
    );

    console.log(`this is action ${action}`);
    console.log(` action === "deleting" ${action === "deleting"}`);

    let updatedCount =
      action === "deleting"
        ? postCollectionCount.count - 1
        : postCollectionCount.count + 1;

    const updatedCountDoc = await databases.updateDocument(
      conf.databaseId, // databaseId
      conf.collectionsCount, // collectionId
      conf.generalPostsCollectionCount, // documentId for specific collection ex: posts,
      { count: updatedCount }, // data (optional)
    );
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured when updating the posts collection count!",
    });
  }
}

export async function addPost(state, dataFromUseActionState) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  let check = await dataFromUseActionState;
  let data = "";

  data = Object.fromEntries(dataFromUseActionState);

  const { account, databases } = await createSessionClient(session.value);
  const usersAccount = await account.get();
  const response = {};
  let copyOfSubmissionData = null;

  try {
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
    //changing the value into a Boolean
    if (check_sharing_okay === "on") {
      check_sharing_okay = true;
    } else {
      check_sharing_okay = false;
    }

    let isUrlEmbedded = false;

    if (content_type === "video-or-podcast") {
      let resultFromUrlCheck = await checkifUrlIsEmbedded(resource_url);

      if (resultFromUrlCheck === true) {
        isUrlEmbedded = true;
      }
    }

    tags = tags.split(",");
    console.log(`this is content_type ${content_type}`);

    // https://appwrite.io/threads/1129238566019551292

    function ifPropertyDoesntExistAddMessage(propertyName) {
      if (
        propertyName === undefined ||
        propertyName === null ||
        propertyName === ""
      ) {
        return "No value found";
      } else {
        return propertyName;
      }
    }

    const copyOfSubmissionData = {
      check_sharing_okay: ifPropertyDoesntExistAddMessage(check_sharing_okay),
      resource_url: ifPropertyDoesntExistAddMessage(resource_url),
      start_time_hours: ifPropertyDoesntExistAddMessage(start_time_hours),
      start_time_minutes: ifPropertyDoesntExistAddMessage(start_time_minutes),
      start_time_seconds: ifPropertyDoesntExistAddMessage(start_time_seconds),
      summary: ifPropertyDoesntExistAddMessage(summary),
      quote: ifPropertyDoesntExistAddMessage(quote),
      shared_by_user: ifPropertyDoesntExistAddMessage(shared_by_user),
      content_type: ifPropertyDoesntExistAddMessage(content_type),
      tags: ifPropertyDoesntExistAddMessage(tags),
      isUrlEmbedded: ifPropertyDoesntExistAddMessage(isUrlEmbedded),
    };

    if (!check_sharing_okay) {
      throw new Error(
        "the checkbox to confirm sharing is okay was not checked, cannot proceed.",
      );
    }

    const dataFromServer = await databases.createDocument(
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
        isUrlEmbedded: isUrlEmbedded,
      },
      [
        Permission.read(Role.any()), // Anyone can view this document
        Permission.delete(Role.user(usersAccount.$id)), // This user can delete this document
        Permission.update(Role.user(usersAccount.$id)), // This user can edit this document
      ],
    );
    revalidatePath("/");

    response.data = copyOfSubmissionData;
    response.message = "Success! Your post was successfully submitted!";
    updatePostCount("adding");
    return response;
  } catch (error) {
    console.error("Error creating post:", error);

    if (copyOfSubmissionData !== undefined) {
      response.data = copyOfSubmissionData;
      response.message =
        "Error! There was a server error when submitting your post!";
    } else {
      response.message = "Error! There was an error when submitting your post!";
      response.data = {
        check_sharing_okay: "error",
        resource_url: "error",
        start_time_hours: "error",
        start_time_minutes: "error",
        start_time_seconds: "error",
        summary: "error",
        quote: "error",
        content_type: "error",
        tags: [],
      };
    }

    return response;
  }
}

export async function updatePost(postId, data) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  const { account, databases } = await createSessionClient(session.value);

  console.log(`this is data from request ${JSON.stringify(data)}`);

  if (data.content_type === "video-or-podcast" && data.resource_url) {
    let resultFromUrlCheck = await checkifUrlIsEmbedded(data.resource_url);

    if (resultFromUrlCheck === true) {
      data.isUrlEmbedded = true;
      console.log("data changed to true");
    } else {
      data.isUrlEmbedded = false;
      console.log("data changed to false");
    }
  }

  const response = await databases.updateDocument(
    conf.databaseId,
    conf.postsCollectionId,
    postId,
    data,
  );
  revalidatePath("/");
  console.log(`this is response ${JSON.stringify(response)}`);
  return response;
}

export async function deletePost(postId) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  try {
    const { account, databases } = await createSessionClient(session.value);

    const response = await databases.deleteDocument(
      conf.databaseId,
      conf.postsCollectionId,
      postId,
    );
    revalidatePath("/");

    // then update post count in count collections
    updatePostCount("deleting");
    return response;
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}
