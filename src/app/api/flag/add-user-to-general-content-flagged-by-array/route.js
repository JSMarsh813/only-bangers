import { createSessionClient, createAdminClient } from "@/appwrite/config";

import { ID, Query } from "appwrite";
import conf from "@/config/envConfig";
import { AppwriteException } from "node-appwrite";

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
      { flagged_by_users: updatedFlaggedByArray },
    );

    return Response.json({ result });
  } catch (error) {
    if (error instanceof AppwriteException) {
      return Response.json(
        {
          message: `An error occured, the document could not be updated due to this code error ${error}!`,
        },
        {
          status: error.code,
          statusText: `An error occured, the document could not be updated due to this error ${error}`,
        },
      );
    } else {
      return Response.json(
        { message: "a server error occured" },
        { status: 500 },
      );
    }
  }
}
