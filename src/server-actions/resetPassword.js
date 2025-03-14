"use server";

import { Client, Account } from "node-appwrite";
//createRecovery didn't work with node-appwrite
import conf from "../config/envConfig";

//https://appwrite.io/docs/references/cloud/client-web/account

export async function createRecoveryPassword(currentState, formData) {
  try {
    const client = new Client()
      .setEndpoint(conf.appwriteUrl) //api endpoint url
      .setProject(conf.projectId); // Your project ID

    //since react 19 useActionState sends data from forms as a formdata object
    let objectFromForm = Object.fromEntries(formData);
    let emailString = Object.values(objectFromForm)[0];

    const account = new Account(client);

    const result = await account.createRecovery(
      emailString, //email
      `${conf.baseFetchUrl}/recovery`, //url
    );
    console.log(result); // Success
    return result;
  } catch (error) {
    console.log(error); // Failure
    return error;
  }
}
