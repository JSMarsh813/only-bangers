"use server";

import { Client, Account } from "node-appwrite";
import conf from "../config/envConfig";

//https://appwrite.io/docs/references/cloud/client-web/account

export async function createRecoveryPassword(
  state: { messageToUser: string } | null,
  formData: FormData,
): Promise<{ messageToUser: string } | null> {
  // if you look at the return statements below, you see we're returning objects with a messageToUser property
  // State: {"messageToUser":"If  exists in our database an email has been sent for account recovery. If you do not see the email within a few minutes, please check your spam folder"}

  //since react 19 useActionState sends data from forms as a formdata object we use the FormData type

  //we're returning a promise with 2 possible types

  const objectFromForm = Object.fromEntries(formData);

  const emailStringFormDataEntryType = objectFromForm["email"];
  console.log(
    `this is emailStringFormDataEntryType ${JSON.stringify(
      emailStringFormDataEntryType,
    )} typeof ${typeof emailStringFormDataEntryType}`,
  );
  const emailString: string = emailStringFormDataEntryType as string;
  console.log(
    `this is emailString ${emailString} typeof ${typeof emailString}`,
  );
  //forDataEntryValues can either be files or strings, in this case we're sure that it will be a string so I'm just doing type assertion
  //however if a file was sent instead of a string, this could lead to runtime errors
  //we need to convert it to a string because AppWrite's account.CreateRecovery requires 2 string values

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
