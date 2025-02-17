import { Client, Databases } from "appwrite";

export const client = new Client();

// console.log(process.env.appwrite_project_id)
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67b0e6de0034c99d7bdf"); // Replace with your project ID
//putting it in a template literal fixed the error: "Project with the requested ID could not be found. Please check the value of the X-Appwrite-Project "
export const databases = new Databases(client);

// const documents = databases.createDocument(
//   "<DATABASE_ID>",
//   "<COLLECTION_ID>",
//   ID.unique(),
//   { title: "Hamlet" },
// );
