"use server";

import { databases } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { Permission, Role } from "node-appwrite";
import conf from "../config/config";
import { createSessionClient } from "@/appwrite/config";

export async function createNewUser(newUsersId, name) {
  console.log(`this is within createUser ${newUsersId}, ${name}`);

  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  console.log(`this is session value ${session.value}`);

  try {
    // https://github.com/nickgatzoulis/youtube-tutorials/blob/main/appwrite/functions/create-user/src/main.ts
    // https://github.com/appwrite/sdk-for-node
    //https://appwrite.io/docs/products/auth/server-side-rendering
    const { account } = await createSessionClient(session.value);

    console.log(`this is current session ${JSON.stringify(account.get())}`);

    console.log(`this is account ${JSON.stringify(account)}`);
    const newUser = await databases.createDocument(
      conf.databaseId,
      conf.usersCollectionId,
      newUsersId,
      { user_name: name },
      [
        Permission.read(Role.any()), // Anyone can view this document
        Permission.delete(Role.user(String(newUsersId))), // This user can delete this document
        Permission.update(Role.user(String(newUsersId))), // This user can delete this document
      ],
    );
    console.log(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}
