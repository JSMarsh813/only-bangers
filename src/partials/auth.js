import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient, createSessionClient } from "../appwrite/config";
import { ID, Permission, Role } from "node-appwrite";
import { databases } from "../utils/appwrite";
import conf from "@/config/config";
import { createNewUser } from "../actions/createUser";

const auth = {
  user: null,
  sessionCookie: null,

  getUser: async () => {
    const cookieStore = await cookies();
    auth.sessionCookie = cookieStore.get("session");
    try {
      const { account } = await createSessionClient(auth.sessionCookie.value);
      auth.user = await account.get();
    } catch {
      auth.user = null;
      auth.sessionCookie = null;
    }
    return auth.user;
  },

  createSession: async (formData) => {
    "use server";

    const data = Object.fromEntries(formData);
    const { email, password } = data;

    //sessionclient can't create a session, we instead have to use createAdminClient which has an api key with a lot of permissions, including making sessions

    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);
    //then once that session is made with createAdminClient, we set that session in the clients cookies
    const cookieStore = await cookies();
    cookieStore.set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });
    //then we want to redirect the user once they're logged in
    redirect("/dashboard");
  },

  signUpWithEmail: async (formData) => {
    "use server";

    const data = Object.fromEntries(formData);
    const { email, password, name } = data;

    const { account } = await createAdminClient();
    //createAdminClient has the permissions to create a new account
    const newUsersId = ID.unique();

    await account.create(newUsersId, email, password, name);
    const session = await account.createEmailPasswordSession(email, password);

    const cookieStore = await cookies();
    cookieStore.set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });
    // a document in the user collection with the same id

    //then once that session is made with createAdminClient, we set that session in the clients cookies

    //error: Error: Route "/signup" used `cookies().set('my-custom-session', ...)`. `cookies()` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    console.log(`this is new users id ${newUsersId}`);
    createNewUser(newUsersId, name);
    //then we want to redirect the user once they're logged in
    redirect("/dashboard");
  },

  // createNewUser: async (newUsersId, name) => {
  //   "use server";
  //   const cookieStore = await cookies();
  //   auth.sessionCookie = cookieStore.get("session");
  //   try {
  //     const newUser = await databases.createDocument(
  //       conf.databaseId,
  //       conf.usersCollectionId,
  //       newUsersId,
  //       { name: name },
  //       [
  //         Permission.read(Role.any()), // Anyone can view this document
  //         Permission.update(Role.team("admin")), // Admins can update this document
  //         Permission.delete(Role.user(newUsersId)), // This user can delete this document
  //         Permission.delete(Role.team("admin")), // Admins can delete this document
  //         Permission.delete(Role.user(newUsersId)), // This user can delete this document
  //       ],
  //     );
  //     console.log(JSON.stringify(newUser));
  //   } catch (error) {}
  // },

  deleteSession: async () => {
    "use server";
    const cookieStore = await cookies();
    auth.sessionCookie = cookieStore.get("session");
    try {
      const { account } = await createSessionClient(auth.sessionCookie.value);
      await account.deleteSession("current");
    } catch (error) {}

    cookies().delete("session");
    auth.user = null;
    auth.sessionCookie = null;
    redirect("/login");
  },
};

export default auth;
