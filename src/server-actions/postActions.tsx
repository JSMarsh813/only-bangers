"use server";

// import { databases } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { ID, Permission, Role } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite/config";
import conf from "@/config/envConfig";
import { revalidatePath } from "next/cache";
import checkifUrlIsEmbedded from "../utils/checkIfUrlWillLoad";

type PostResponseType = {
  data: FormStateType;
  //copyOfSubmissionData
  message: string;
  //"Success! Your post was successfully submitted!";
  error?: string | boolean;
};

async function updatePostCount(action: "adding" | "deleting") {
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

    const updatedCount =
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
    return Response.json({
      error: "true",
      // POSSIBLE ERROR LATER: this used to be Response.json("error", {
      // message: "An error occured when updating the posts collection count!",
      // });
      message: "An error occured when updating the posts collection count!",
    });
  }
}

export async function addPost(
  state: PostResponseType | null,
  dataFromUseActionState: FormData,
): Promise<PostResponseType | null> {
  //useActionState will make state be FormStateType or type of null so  FormStateType | null was needed

  //addPost will return a promise of the response object
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (session === undefined) {
    console.log("an error occured, there is no session in the cookie store");
    return null;
  }
  // const check = await dataFromUseActionState;
  const check = dataFromUseActionState;
  // let data: FormStateType | string = " ";
  //using a union type, initalizing the data variable as a " " string
  // data starts as a string (" "), but it can later have an object assigned to it

  const FormEntriesToArray = Object.fromEntries(dataFromUseActionState);

  const { account, databases } = await createSessionClient(session.value);
  const usersAccount = await account.get();
  const response = {} as PostResponseType;
  //to declare the response object and then fill it in later

  //we want to share the data with the try AND catch block, so we start off with the worst case version for the catch block
  // if we enter the try block, we will overwrite the "no value found" with the values
  let data: FormStateType = {
    check_sharing_okay: "No value found",
    resource_url: "No value found",
    start_time_hours: 0,
    start_time_minutes: 0,
    start_time_seconds: 0,
    summary: "No value found",
    quote: "No value found",
    shared_by_user: "No value found",
    has_a_play_button: "No value found",
    tags: "No value found",
    isUrlEmbedded: "No value found",
  };

  try {
    data = {
      check_sharing_okay: FormEntriesToArray.check_sharing_okay === "on",
      resource_url: String(FormEntriesToArray.resource_url),
      start_time_hours: Number(FormEntriesToArray.start_time_hours),
      start_time_minutes: Number(FormEntriesToArray.start_time_minutes),
      start_time_seconds: Number(FormEntriesToArray.start_time_seconds),
      summary: String(FormEntriesToArray.summary),
      quote: String(FormEntriesToArray.quote),
      shared_by_user: String(FormEntriesToArray.shared_by_user),
      has_a_play_button: FormEntriesToArray.has_a_play_button as
        | "yes"
        | "no"
        | "error",
      tags: String(FormEntriesToArray.tags).split(","),
      isUrlEmbedded: false, // or set as needed
    };

    let isUrlEmbedded = false;

    if (data.has_a_play_button === "yes") {
      const resultFromUrlCheck = await checkifUrlIsEmbedded(data.resource_url);

      if (resultFromUrlCheck === true) {
        isUrlEmbedded = true;
      }
    }

    // https://appwrite.io/threads/1129238566019551292

    function ifPropertyDoesntExistAddMessage(
      propertyName: string | number | null | undefined | boolean | string[],
    ) {
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

    // const copyOfSubmissionData = {
    //   check_sharing_okay: ifPropertyDoesntExistAddMessage(
    //     data.check_sharing_okay,
    //   ),
    //   resource_url: ifPropertyDoesntExistAddMessage(data.resource_url),
    //   start_time_hours: ifPropertyDoesntExistAddMessage(data.start_time_hours),
    //   start_time_minutes: ifPropertyDoesntExistAddMessage(
    //     data.start_time_minutes,
    //   ),
    //   start_time_seconds: ifPropertyDoesntExistAddMessage(
    //     data.start_time_seconds,
    //   ),
    //   summary: ifPropertyDoesntExistAddMessage(data.summary),
    //   quote: ifPropertyDoesntExistAddMessage(data.quote),
    //   shared_by_user: ifPropertyDoesntExistAddMessage(data.shared_by_user),
    //   has_a_play_button: ifPropertyDoesntExistAddMessage(
    //     data.has_a_play_button,
    //   ),
    //   tags: ifPropertyDoesntExistAddMessage(data.tags),
    //   isUrlEmbedded: ifPropertyDoesntExistAddMessage(data.isUrlEmbedded),
    // };

    if (data.check_sharing_okay === false) {
      throw new Error(
        "the checkbox to confirm sharing is okay was not checked, cannot proceed.",
      );
    }

    const dataFromServer = await databases.createDocument(
      conf.databaseId,
      conf.postsCollectionId,
      ID.unique(),
      {
        check_sharing_okay: data.check_sharing_okay,
        resource_url: data.resource_url,
        start_time_hours: data.start_time_hours,
        start_time_minutes: data.start_time_minutes,
        start_time_seconds: data.start_time_seconds,
        summary: data.summary,
        quote: data.quote,
        shared_by_user: data.shared_by_user,
        has_a_play_button: data.has_a_play_button,
        tags: data.tags,
        isUrlEmbedded: isUrlEmbedded,
      },
      [
        Permission.read(Role.any()), // Anyone can view this document
        Permission.delete(Role.user(usersAccount.$id)), // This user can delete this document
        Permission.update(Role.user(usersAccount.$id)), // This user can edit this document
      ],
    );
    revalidatePath("/");

    response.data = data;
    response.message = "Success! Your post was successfully submitted!";
    updatePostCount("adding");
    return response;
  } catch (error) {
    console.error("Error creating post:", error);

    if (data !== undefined) {
      response.data = data;
      response.message =
        "Error! There was a server error when submitting your post!";
    } else {
      response.message = "Error! There was an error when submitting your post!";
      response.data = {
        check_sharing_okay: "error",
        shared_by_user: "error",
        isUrlEmbedded: "error",
        resource_url: "error",
        start_time_hours: 0,
        start_time_minutes: 0,
        start_time_seconds: 0,
        summary: "error",
        quote: "error",
        has_a_play_button: "error",
        tags: [],
      };
    }

    return response;
  }
}

export async function updatePost(postId: string, data: FormStateType) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (session === undefined) {
    console.log("an error occured, there is no session in the cookie store");
    return;
  }

  const { account, databases } = await createSessionClient(session.value);

  if (data.has_a_play_button === "yes" && data.resource_url) {
    const resultFromUrlCheck = await checkifUrlIsEmbedded(data.resource_url);

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

  return response;
}

export async function deletePost(postId: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (session === undefined) {
    console.log("an error occured, there is no session in the cookie store");
    return;
  }

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
