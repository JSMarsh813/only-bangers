import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient, createSessionClient } from "../appwrite/config";

const auth = {
  user: null,
  sessionCookie: null,
  getUser: async () => {
    auth.sessionCookie = cookies().get("session");
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

    cookies().set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });
    //then we want to redirect the user once they're logged in
    redirect("/");
  },

  deleteSession: async () => {
    "use server";
    auth.sessionCookie = cookies().get("session");
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
