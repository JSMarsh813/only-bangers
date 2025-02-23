import conf from "@/config/config";
import { Client, Databases, Account, ID } from "node-appwrite";

//################## Admin Client ###################

const createAdminClient = async () => {
  // client is what talks to appwrite
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID)
    .setKey(process.env.NEXT_PUBLIC_API_KEY);

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },
  };
};

//################## Session Client ###################

const createSessionClient = async (session) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

  //this is how we authenticate the user, we're passing the session to the client
  console.log(`this is session in config ${session}`);
  if (session) {
    client.setSession(session);
  }

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },
  };
};

export { createAdminClient, createSessionClient };
