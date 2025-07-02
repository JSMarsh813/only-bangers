import React from "react";
import GeneralButton from "../GeneralButton";
import Link from "next/link";
import signOutUserfunction from "@/utils/signOutUser";

type AlreadySignedInNotificationType = {
  currentUsersName: string;
  setTriggerRecheck: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function AlreadySignedInNotification({
  currentUsersName,
  setTriggerRecheck,
}: AlreadySignedInNotificationType) {
  function handleSignout(event: React.FormEvent<HTMLFormElement>) {
    try {
      signOutUserfunction({ event, setTriggerRecheck });
    } catch {
      console.log("log out was not successful");
    }
  }
  return (
    <section className="mx-auto bg-blue-950 rounded-lg w-[94vw] text-center text-white pt-2 border-2 border-yellow-300 mb-6">
      <p className="mb-2">
        You&apos;re already signed in as
        <span className="font-semibold">{` ${currentUsersName}!`} </span>
      </p>

      <p className="mb-2">Do you wish to sign in to another account?</p>

      <div className="flex justify-center gap-6">
        <form onSubmit={handleSignout}>
          <GeneralButton
            text="Yes, sign out"
            type="submit"
            className="bg-red-900"
          />
        </form>
        <Link
          href="/dashboard"
          className="font-bold my-3 py-3 px-4 border-b-4
          shadow-lg shadow-stone-900/70 
      
          hover:bg-white hover:text-100devs hover:border-100devs rounded text-base  disabled:bg-slate-700 disabled:text-white disabled:border-white bg-green-800"
        >
          No, go to dashboard
        </Link>
      </div>
    </section>
  );
}
