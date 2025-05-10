import { ID, Query } from "appwrite";
import { createAdminClient } from "@/appwrite/config";
//admin is needed because users don't have permission to edit post documents, so we need admin's api permission to update the documents "liked by" field
import conf from "../../../../config/envConfig";
export async function PUT(request, response) {
  const { account, databases } = await createAdminClient();
  if (request.method !== "PUT") {
    return request
      .status(400)
      .send({ message: `${request.method} not supported` });
  }

  try {
    //request.method is immediately viewable but request.body needs more time to be sent or we'll just get an empty object
    // so we await the request
    const body = await request.json();

    const currentTargetedId = String(body.currentTargetedId);
    const signedInUsersId = String(body.signedInUsersId);

    //I could pass the document's data as a request parameter, but I want the least amount of time between the request and response. Because we have to overwrite liked_by_users original array, we want to grab the newest version possible of the document, otherwise we might not see that another user liked the post. So if we pass it as a parameter, we could be filtering on old data, and essentially erase their like because we never saw it

    let documentObject = await databases.getDocument(
      conf.databaseId, // databaseId
      conf.postsCollectionId, // collectionId
      currentTargetedId, // documentId
      [Query.select(["liked_by_users", "liked_by_users_length"])],
    );
    //returns an object,
    // {
    //   liked_by_users: [],
    //   '$databaseId': '6333333',
    //   '$collectionId': '6234234333333'
    // you can't filter out databaseId and CollectionId from the object that gets returned
    //so we need to turn the object into an array of it' values. Then grab the first value to get the liked_by_users array
    let currentLikedByArray = Object.values(documentObject)[0];
    let currentLikedByArrayLength = Object.values(documentObject)[1];

    // for appwrite you have to grab the entire array, then replace the original value with it
    // theres no way to just push or filter directly with appwrite
    let updatedLikedByArray = [];
    let updatedLikedByArrayLength = 0;
    if (currentLikedByArray.includes(signedInUsersId)) {
      updatedLikedByArray = currentLikedByArray.filter(
        (userinlikedby) => userinlikedby != signedInUsersId,
      );
      if (currentLikedByArray > 0 || currentLikedByArray === null) {
        updatedLikedByArrayLength = currentLikedByArrayLength - 1;
      } else {
        console.log(
          "an error occured in updateLikes, likes is <= 0 so it can't be subtracted from",
        );
      }
    } else {
      updatedLikedByArray = currentLikedByArray.concat(signedInUsersId);

      updatedLikedByArrayLength =
        currentLikedByArray === null
          ? (currentLikedByArrayLength = 1)
          : currentLikedByArrayLength + 1;
    }

    const result = await databases.updateDocument(
      conf.databaseId, // databaseId
      conf.postsCollectionId, // collectionId
      currentTargetedId, // documentId
      {
        liked_by_users: updatedLikedByArray,
        liked_by_users_length: updatedLikedByArrayLength,
      }, // data (optional)
    );

    return Response.json({ result });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured!",
    });
  }
}

// async function handler(req, res) {

//     const toUpdateName = await Names.findById(nameId);

//    toUpdateName.likedby.includes(user)
//       ? (toUpdateName.likedby = toUpdateName.likedby.filter(
//           (userinlikedby) => userinlikedby != user,
//         ))
//       : (toUpdateName.likedby = toUpdateName.likedby.concat(user));

//     await toUpdateName.save();

//     res.send({
//       message: "Names likes updated",
//     });
//   }

//   export default handler;
