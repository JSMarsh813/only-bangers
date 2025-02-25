import { ID, Query } from "appwrite";
import { createAdminClient } from "@/appwrite/config";
//admin is needed because users don't have permission to edit post documents, so we need admin's api permission to update the documents "liked by" field
import conf from "../../../../config/envConfig"
export async function PUT(request, response) {
  const { account, databases } = await createAdminClient();
  if (request.method !== "PUT") {
    return request
      .status(400)
      .send({ message: `${request.method} not supported` });
  }

  console.log(`this is request outside await${JSON.stringify(request.body)}`)

  try {
    //request.method is immediately viewable but request.body needs more time to be sent or we'll just get an empty object
    // so we await the request
    const body = await request.json()
    
    const currentTargetedId= String(body.currentTargetedId)
    const signedInUsersId=String(body.signedInUsersId)
  
   //I could pass the document's data as a request parameter, but I want the least amount of time between the request and response. Because we have to overwrite liked_by_users original array, we want to grab the newest version possible of the document, otherwise we might not see that another user liked the post. So if we pass it as a parameter, we could be filtering on old data, and essentially erase their like because we never saw it

    let documentObject = await databases.getDocument(
      conf.databaseId, // databaseId
      conf.postsCollectionId, // collectionId
      currentTargetedId, // documentId
      [
        Query.select(["liked_by_users"]), 
      ]
    )
    //returns an object, 
    // {
    //   liked_by_users: [],
    //   '$databaseId': '6333333',
    //   '$collectionId': '6234234333333'
    // you can't filter out databaseId and CollectionId from the object that gets returned
    //so we need to turn the object into an array of it' values. Then grab the first value to get the liked_by_users array
  let currentLikedByArray= Object.values(documentObject)[0]
   
    console.log(`this is currentLikedByArray ${JSON.stringify(currentLikedByArray)}`)
   // for appwrite you have to grab the entire array, then replace the original value with it
   // theres no way to just push or filter directly with appwrite
    let updatedLikedByArray=currentLikedByArray.includes(signedInUsersId)
          ? (currentLikedByArray= currentLikedByArray.filter(
               (userinlikedby) => userinlikedby != signedInUsersId,
            ))
           : (currentLikedByArray = currentLikedByArray.concat(signedInUsersId));
    console.log(`this is updatedLikedByArray ${updatedLikedByArray}`)
    const result = await databases.updateDocument(
      conf.databaseId, // databaseId
      conf.postsCollectionId, // collectionId
      currentTargetedId, // documentId
      {"liked_by_users":updatedLikedByArray}, // data (optional)
    );
    console.log(`this is result ${result}`)

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
