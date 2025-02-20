import { Client, Databases } from "appwrite";

import { databases } from "../../../utils/appwrite";
import { ID, Query } from "appwrite";

export async function PUT(request, response) {
  if (request.method !== "PUT") {
    return request
      .status(400)
      .send({ message: `${request.method} not supported` });
  }

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data

    const result = await databases.updateDocument(
      "<DATABASE_ID>", // databaseId
      "<COLLECTION_ID>", // collectionId
      "<DOCUMENT_ID>", // documentId
      {}, // data (optional)
    );

    return Response.json({ posts });
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
