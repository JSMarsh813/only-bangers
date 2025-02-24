import conf from "@/config/envConfig";
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
  //this is session in config eyJpZCI6IjY3YmMwNTQwMDAxOWQ0NTM2MTYxIiwic2VjcmV0IjoiN2ZiNmMzNDZiZWQzYzk3MzM3MWRmZTRiYWViNWM0NmNhZDBjOTdiN2IwMmNkNWMwYTMwMWZlNTExNTlhNWQxYjNlZWQxMDAzYjMzYjQ5YzM0OWUxNDA3YWU1MTEwZDgwYTQyM2E5NGE5NThkMTAwMzA3NDcxNzE1YjA3ZjRlMWQzMDNjMTA2NmViMmE0NzFjZmY5YmI2Y2M5MGMyMzQzZjRjZmJhYjFhNzNiMmUyNDJmYjk0ZDc5YTJiY2RiNzQ3MDBiMjQ4OGIzOGI4ODg2OGIyYzIyNGVjMmFlZjUyZTQyN2ZlMzdmM2EzOGVkNTNhNGM4ZjVhOGFmMGI3YWViMyJ9

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
