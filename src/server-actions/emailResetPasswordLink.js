"use server";

import { Client, Account } from "node-appwrite";
import conf from "../config/envConfig";

//https://appwrite.io/docs/references/cloud/client-web/account

export async function createRecoveryPassword(currentState, formData) {
  //since react 19 useActionState sends data from forms as a formdata object
  let objectFromForm = Object.fromEntries(formData);
  let emailString = Object.values(objectFromForm)[0];

  try {
    const client = new Client()
      .setEndpoint(conf.appwriteUrl) //api endpoint url
      .setProject(conf.projectId); // Your project ID

    const account = new Account(client);

    const result = await account.createRecovery(
      emailString, //email
      `${conf.baseFetchUrl}/recovery`, //url
    );

    return {
      messageToUser: `If ${emailString} exists in our database an email has been sent for account recovery. If you do not see the email within a few minutes, please check your spam folder`,
    };
  } catch (error) {
    console.log(error); // Failure
    return {
      messageToUser: `If ${emailString} exists in our database an email has been sent for account recovery. If you do not see the email within a few minutes, please check your spam folder`,
    };
  }
}
