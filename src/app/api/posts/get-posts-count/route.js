import { ID, Query } from "appwrite";
import { createAdminClient, createSessionClient } from "@/appwrite/config";
//admin is needed because users don't have permission to edit post documents, so we need admin's api permission to update the documents "liked by" field
import conf from "../../../../config/envConfig";

export async function GET(request) {
  const { account, databases } = await createSessionClient();

  //   const body = await request.json();
  // console.log(body);
  //{ usersId: '67c81d310034f8b059f1' }
  //   let currentUsersId = body.usersId;
  //67c81d310034f8b059f1
  // console.log(`${currentUsersId}`);
  console.log("we are in get posts count");

  try {
    const postCount = await databases.getDocument(
      conf.databaseId, // databaseId
      conf.collectionsCount, // collectionId
      "68169d220030c4571141", // documentId for specific collection ex: posts
    );

    return Response.json({ postCount });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured!",
    });
  }
}

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

    //I could pass the document's data as a request parameter, but I want the least amount of time between the request and response. Because we have to overwrite liked_by_users original array, we want to grab the newest version possible of the document, otherwise we might not see that another user liked the post. So if we pass it as a parameter, we could be filtering on old data, and essentially erase their like because we never saw it

    let documentObject = await databases.getDocument(
      conf.databaseId, // databaseId
      conf.postsCollectionId, // collectionId
      "68169d220030c4571141", // documentId
    );

    let currentCount = Object.values(documentObject)[0];

    let updatedCount = subtracting // are we subtracting or adding
      ? currentCount--
      : currentCount++;

    const result = await databases.updateDocument(
      conf.databaseId, // databaseId
      conf.postsCollectionId, // collectionId
      "68169d220030c4571141", // documentId
      { count: updatedCount }, // data (optional)
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
