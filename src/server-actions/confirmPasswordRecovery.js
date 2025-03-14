"use server";

import { Client, Account } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite/config";
import conf from "../config/envConfig";

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
    const client = createSessionClient();
    //since react 19 useActionState sends data from forms as a formdata object
    const account = new Account(client);

    const result = await account.updateRecovery(
      userId, // userId
      secret, // secret
      password, // password
    );
    console.log(result); // Success

    //1. https://appwrite.io/docs/references/cloud/server-nodejs/users
    async function createToken(userId) {
      const { account } = await createAdminClient();

      const userToken = new Account.Users(account);

      const token = await userToken.createToken(
        userId, // userId
        4, // length (optional)
        60, // expire (optional)
      );
      return token;
    }

    const sessionToken = await createToken(userId);
    console.log(`this is sessiontoken ${sessionToken}`);
    //2. https://appwrite.io/docs/references/cloud/client-web/account#createSession
    const newSession = await account.createSession(userId, sessionToken);
    console.log(`this is new session ${newSession}`);
    return result;
  } catch (error) {
    console.log(error); // Failure
    return error;
  }
}
