import { createSessionClient } from "@/lib/appwrite/config";
import { cookies } from "next/headers";
import { Permission, Role } from "node-appwrite";
import { ID, Query } from "appwrite";
import conf from "@/config/envConfig";
import { AppwriteException } from "node-appwrite";

export async function POST(request, response) {
  const body = await request.json();

  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  const { account, databases } = await createSessionClient(session.value);

  const usersAccount = await account.get();

  const {
    contentid,
    contentcopy,
    createdbyuser,
    flaggedbyuser,
    flagcategories,
    comments,
  } = body;

  try {
    const result = await databases.createDocument(
      conf.databaseId,
      conf.reportsCollectionId,
      ID.unique(),
      body,
      //must be from the variable with the validated saved user info, it can't just be the string of the user
      [Permission.update(Role.user(usersAccount.$id))],
    );
    return Response.json({ result });
  } catch (error) {
    if (error instanceof AppwriteException) {
      return Response.json(
        {
          message: `An error occured, the document could not be updated due to this error ${error}!`,
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
