import { createSessionClient } from "@/appwrite/config";
import trimAppwriteDocument from "../../../../utils/trimAppwriteDocument";
import { ID, Query } from "appwrite";
import conf from "@/config/envConfig";

export async function POST(request: Request) {
  //unlike express, in Next.js app router we don't have a request and response
  // express signature Post(request,response)
  // express.js returns res.send(...)

  // in Next.js App Router, you're creating an API route using a standard Web Fetch API handler
  // Next.js App router signature POST(request: Request)
  // Next.js App router returns Response

  const { account, databases } = await createSessionClient();

  //   const sessionCookie = cookies().get("session");

  try {
    const body = await request.json();
    const currentUsersId = body.usersId;

    // console.log(`this is body ${JSON.stringify(currentUsersId)}`);

    const currentTargetedId = String(currentUsersId);
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    // console.log("get specific user reached");
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
    //1️⃣ First argument: any JSON-serializable value (string, object, number, etc.)
    //2️⃣ Second argument: must be a valid ResponseInit object — only status, statusText, and headers are allowed

    //Original JS code:
    // return Response.json("error", {
    // message: "An error occured!",
    // });

    //resulted in this typescript error:
    // Object literal may only specify known properties, and 'message' does not exist in type 'ResponseInit'.ts(2353)

    // interface ResponseInit {
    // status?: number;
    // statusText?: string;
    // headers?: HeadersInit;

    //the problem is the 2nd property, {
    // message: "An error occured!",
    // }
    //  message is not status, statusText or headers which are properties on ResonseInit

    //for example this would be fine: return Response.json("error", {
    //   status: 500,
    // });
  }

  //Fixed TS code:
  // return Response.json({error:"error",
  //   message: "An error occured!",
  // });
}
