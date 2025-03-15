"use server";

import { createAdminClient, createSessionClient } from "../appwrite/config";
import { NextResponse } from "next/server";

export default async function confirmPasswordRecovery({
  password,
  password_repeat,
  userId,
  secret,
}) {
  console.log(password);
  console.log(userId);
  console.log(secret);
  try {
    const { account, databases } = await createSessionClient();

    const result = await account.updateRecovery(
      userId, // userId
      secret, // secret
      password, // password
    );
    console.log(`this is result ${result}`); // Success

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
    console.log("we are in confirm password recovery's catch");
    console.log(JSON.stringify(error.response)); // Failure
    console.log(error); // Failure
    //Response.Json() or NextResponse kept resulting in this error:
    //Uncaught (in promise) Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
    // {}
    // NextJS 47
    // instantiateModule dev-base.ts:205
    // runModuleExecutionHooks dev-base.ts:264
    // instantiateModule dev-base.ts:203
    // getOrInstantiateRuntimeModule dev-base.ts:101
    // registerChunk runtime-backend-dom.ts:81
    // registerChunk runtime-base.ts:323
    // NextJS 2
    // so i created a simple object instead
    return {
      messageToUser: "an error occured",
      messageForDev: JSON.stringify(error.response),
      status: "error",
    };
  }
}
