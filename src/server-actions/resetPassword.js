import { Client, Account } from "node-appwrite";
import conf from "../config/envConfig";

//https://appwrite.io/docs/references/cloud/client-web/account
export async function createRecoveryPassword(currentState, formData) {
  console.log(conf.projectId);
  console.log(conf.appwriteUrl);
  try {
    const client = new Client()
      .setEndpoint(conf.appwriteUrl) //api endpoint url
      .setProject(conf.projectId); // Your project ID
    let objectFromForm = Object.fromEntries(formData);
    let email = Object.values(objectFromForm)[0];
    console.log(email);
    console.log(conf.baseFetchUrl);

    const account = new Account(client);

    const result = await account.createRecovery(
      { email }, //email
      `${conf.baseFetchUrl}`, //url
    );
    console.log(result); // Success
    return result;
  } catch (error) {
    console.log(error); // Failure
    return error;
  }
}
