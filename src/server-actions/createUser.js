"use server";

// import { databases } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { Permission, Role } from "node-appwrite";
import conf from "../config/envConfig";
import { createSessionClient } from "@/appwrite/config";

export async function createNewUser(name) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  try {
    const { account, databases } = await createSessionClient(session.value);

    const usersAccount = await account.get();

    //this is result "67bc05400019d4536161"

    const newUser = await databases.createDocument(
      conf.databaseId,
      conf.usersCollectionId,
      usersAccount.$id,
      { user_name: name },
      [
        Permission.read(Role.any()), // Anyone can view this document
        Permission.delete(Role.user(usersAccount.$id)), // This user can delete this document
        Permission.update(Role.user(usersAccount.$id)), // This user can edit this document
      ],
    );
  } catch (error) {
    console.log(error);
  }
}

// https://github.com/nickgatzoulis/youtube-tutorials/blob/main/appwrite/functions/create-user/src/main.ts
// https://github.com/appwrite/sdk-for-node
//https://appwrite.io/docs/products/auth/server-side-rendering
// console.log(`this is within createUser ${newUsersId}, ${name}`);
