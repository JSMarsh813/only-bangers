import { deleteSession } from "../server-actions/auth";

//signing out is available in multiple places (navbar, login page, signup page) so I made it a utility

type SignOutUsersTypes = {
  event: React.FormEvent<HTMLFormElement>;
  setTriggerRecheck: React.Dispatch<React.SetStateAction<boolean>>;
};
export default async function signOutUser({
  event,
  setTriggerRecheck,
}: SignOutUsersTypes) {
  //needs to be awaited, or the context will try to update before the users cookies have been deleted!

  //in other words delete session has to be awaited to update that the user has signed out
  await deleteSession();

  setTriggerRecheck(true);

  // router.push("/login");

  // Originally I did the redirect in the server logic for deletesession
  // however redirect("/login") was resulting in these errors, so i used useRouter in the signout button component instead since i tried multiple alternatives but none got rid of the error message
  //Uncaught (in promise) Error: NEXT_REDIRECT
  //Uncaught (in promise) TypeError: NetworkError when attempting to fetch resource.
}
