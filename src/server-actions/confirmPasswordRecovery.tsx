"use server";

import { AppwriteException } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite/config";

type PasswordRecoveryFormKeys =
  | "password"
  | "password_repeat"
  | "userId"
  | "secret";

type PasswordRecoveryFormValues = {
  [K in PasswordRecoveryFormKeys]: string;
};

export default async function confirmPasswordRecovery({
  password,
  password_repeat,
  userId,
  secret,
}: PasswordRecoveryFormValues) {
  try {
    const { account, databases } = await createSessionClient();

    const result = await account.updateRecovery(
      userId, // userId
      secret, // secret
      password, // password
    );

    //1. https://appwrite.io/docs/references/cloud/server-nodejs/users
    // async function createToken(userId) {
    //   const { account } = await createAdminClient();

    //   const userToken = new Account.Users(account);

    //   const token = await userToken.createToken(
    //     userId, // userId
    //     4, // length (optional)
    //     60, // expire (optional)
    //   );
    //   return token;
    // }

    // const sessionToken = await createToken(userId);
    // console.log(`this is sessiontoken ${sessionToken}`);

    // //2. https://appwrite.io/docs/references/cloud/client-web/account#createSession
    // const newSession = await account.createSession(userId, sessionToken);
    // console.log(`this is new session ${newSession}`);
    return {
      messageToUser: "password successfully reset! Redirecting to login page.",
      messageForDev: "password successfully reset!",
      status: "success",
    };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return {
        messageToUser: "an error occured",
        messageForDev: JSON.stringify(error.response),
        status: "error",
      };
    }

    //Response.Json() or NextResponse kept resulting in this error:
    //Uncaught (in promise) Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
    // {}
    // NextJS 47
    // so i created a simple object instead
    else {
      console.log(
        "An unexpected error occurred in confirm password recovery that was not an instanceof AppwriteException",
        error,
      );
      return {
        messageToUser: "an error occured",
        messageForDev: `An unexpected error occurred in confirm password recovery that was not an instanceof AppwriteException ${JSON.stringify(
          error,
        )}`,
        status: "error",
      };
    }
  }
}
