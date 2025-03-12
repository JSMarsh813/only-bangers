import { createSessionClient, createAdminClient } from "@/appwrite/config";

import { ID, Query } from "appwrite";
import conf from "@/config/envConfig";

export async function PUT(request, response) {
  const { account, databases } = await createAdminClient();

  if (request.method !== "PUT") {
    return res.status(405).send({ message: `${req.method} not supported` });
  }

  try {
    const body = await request.json();
    const currentTargetedId = body.contentid;
    const flaggedByUser = body.flaggedbyuser;

    let documentObject = await databases.getDocument(
      conf.databaseId, // databaseId
      conf.postsCollectionId, // collectionId
      currentTargetedId, // documentId
      [Query.select(["flagged_by_users"])],
    );

    let objectTrimmedToFlaggedByUsersArray = Object.values(documentObject)[0];

    let updatedFlaggedByArray = "";

    if (objectTrimmedToFlaggedByUsersArray.includes(flaggedByUser)) {
      return Response.json("error", {
        message:
          "You already submitted a report! You can edit the report instead",
      });
    } else {
      updatedFlaggedByArray =
        objectTrimmedToFlaggedByUsersArray.concat(flaggedByUser);
    }

    const result = await databases.updateDocument(
      conf.databaseId, // databaseId
      conf.postsCollectionId, // collectionId
      currentTargetedId, // documentId
      { flagged_by_users: updatedFlaggedByArray }, // data (optional)
    );
    return Response.json({ result });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured!",
    });
  }
}
