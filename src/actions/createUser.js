"use server";

// import { databases } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { Permission, Role } from "node-appwrite";
import conf from "../config/envConfig";
import { createSessionClient } from "@/appwrite/config";

export async function createNewUser(name) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  console.log(`this is session value ${session.value}`);
  // this is session value eyJpZCI6IjY3YmMwNTQwMDAxOWQ0NTM2MTYxIiwic2VjcmV0IjoiN2ZiNmMzNDZiZWQzYzk3MzM3MWRmZTRiYWViNWM0NmNhZDBjOTdiN2IwMmNkNWMwYTMwMWZlNTExNTlhNWQxYjNlZWQxMDAzYjMzYjQ5YzM0OWUxNDA3YWU1MTEwZDgwYTQyM2E5NGE5NThkMTAwMzA3NDcxNzE1YjA3ZjRlMWQzMDNjMTA2NmViMmE0NzFjZmY5YmI2Y2M5MGMyMzQzZjRjZmJhYjFhNzNiMmUyNDJmYjk0ZDc5YTJiY2RiNzQ3MDBiMjQ4OGIzOGI4ODg2OGIyYzIyNGVjMmFlZjUyZTQyN2ZlMzdmM2EzOGVkNTNhNGM4ZjVhOGFmMGI3YWViMyJ9

  try {
    const { account, databases } = await createSessionClient(session.value);

    const usersAccount = await account.get();

    console.log(`this is usersAccount ${JSON.stringify(usersAccount.$id)}`);
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
    console.log(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}

// https://github.com/nickgatzoulis/youtube-tutorials/blob/main/appwrite/functions/create-user/src/main.ts
// https://github.com/appwrite/sdk-for-node
//https://appwrite.io/docs/products/auth/server-side-rendering
// console.log(`this is within createUser ${newUsersId}, ${name}`);
