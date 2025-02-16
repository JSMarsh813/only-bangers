import { Client, Databases } from "appwrite";
// account = authentication

export const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.appwrite_project_id); // Replace with your project ID

export const databases = new Databases(client);

// const documents = databases.createDocument(
//   "<DATABASE_ID>",
//   "<COLLECTION_ID>",
//   ID.unique(),
//   { title: "Hamlet" },
// );

// documents.then(
//   function (response) {
//     console.log(response);
//   },
//   function (error) {
//     console.log(error);
//   },
// );

// export const account = new Account(client);
// export { ID } from "appwrite";
