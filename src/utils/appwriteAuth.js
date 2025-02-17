"use server";

import { Client, Account } from "appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("67b0e6de0034c99d7bdf"); // Replace with your project ID

  const session = await cookies().get("my-custom-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    console.log(error);
    return null;
  }
}

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
