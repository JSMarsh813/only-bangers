import { createSessionClient } from "@/lib/appwrite/config";
import trimAppwriteDocument from "../../../../utils/trimAppwriteDocument";
import { ID, Query } from "appwrite";
import conf from "@/config/envConfig";

export async function POST(request: Request) {
  // unlike express, in Next.js app router we don't have a request and response
  // express signature Post(request,response)
  // express.js returns res.send(...)

  // in Next.js App Router, you're creating an API route using a standard Web Fetch API handler
  // Next.js App router signature POST(request: Request)
  // Next.js App router returns Response

  const { account, databases } = await createSessionClient();

  try {
    const body = await request.json();
    const currentUsersId = body.usersId;

    const currentTargetedId = String(currentUsersId);
    const result = await databases.getDocument(
      conf.databaseId,
      conf.usersCollectionId,
      currentTargetedId,
      [Query.select(["$id", "user_name", "profile_image"])],
    );

    const trimmedUserObject = trimAppwriteDocument(result);

    return Response.json({ trimmedUserObject });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json({ error: "error", message: "An error occured!" });

    //Response.json()
    // First argument: any JSON-serializable value (string, object, number, etc.)
    // Second argument: must be a valid ResponseInit object — only status, statusText, and headers are allowed
  }
}
