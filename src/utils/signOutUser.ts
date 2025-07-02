//signing out is available in multiple places (navbar, login page, signup page) so I made it a utility

type SignOutUsersTypes = {
  event: React.FormEvent<HTMLFormElement>;
  setTriggerRecheck: React.Dispatch<React.SetStateAction<boolean>>;
};
export default async function signOutUser({
  event,
  setTriggerRecheck,
}: SignOutUsersTypes) {
  event.preventDefault();
  //needs to be awaited, or the context will try to update before the users cookies have been deleted!

  //in other words delete session has to be awaited to update that the user has signed out
  await fetch("/api/sign-out-user", { method: "POST" });

  //can't call delete Session directly because its a server action
  // instead a workaround is to use an api as a middleman
  //server actions only run on the server

  //You cannot call a server action (like deleteSession from ../server-actions/auth) directly from a utility function in a client component
  // Why? Because it tries to make a network request to a function that is not exposed as an API endpoint
  // if you try to call deleteSession from the client, you'll get the error " NetworkError when attempting to fetch resource"
  setTriggerRecheck(true);
}
