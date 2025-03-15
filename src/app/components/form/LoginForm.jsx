"use client";

import React, { useEffect } from "react";
import { createSession, getUser } from "@/partials/auth";
import { useUser } from "../../components/context-wrappers/UserInfo";
import { useActionState } from "react";
import { redirect } from "next/navigation";
import GeneralButton from "../GeneralButton";
import Link from "next/link";

export default function LoginForm() {
  let userInfo = useUser();
  let { currentUsersInfo, setTriggerRecheck, triggerRecheck } = userInfo;

  const [state, action, isPending] = useActionState(createSession, null);
  console.log(`this is isPending ${isPending}`);

  //if user is already signed in, redirect to dashboard
  // once user is signed in, redirect to dashboard (thus why we're listening for triggerRecheck to change)

  useEffect(() => {
    async function checkIfUserIsLoggedIn() {
      let loggedIn = await getUser();

      if (loggedIn) {
        redirect("/dashboard");
      }
    }
    checkIfUserIsLoggedIn();
  }, [triggerRecheck]);

  // if the form is pending, then we want to recheck the users info, so update useContext
  useEffect(() => {
    if (isPending === false) {
      setTriggerRecheck(true);
    }
  }, [isPending]);

  return (
    <div className="mx-auto p-4 max-w-md bg-blue-900 text-white">
      <form
        action={action}
        id="login-form"
      >
        <h2 className="mx-auto w-fit text-2xl">Login</h2>

        <div className="">
          <label className="">Email</label>
          <input
            type="email"
            name="email"
            className="w-full my-2 px-2"
            placeholder="Enter your email"
            defaultValue="test@gmail.com"
          />
        </div>
        <div>
          <label className="">Password</label>
          <input
            type="password"
            name="password"
            className="w-full my-2 pl-2"
            placeholder="Enter your password"
            defaultValue="testtest"
          />
        </div>
        <div>
          <GeneralButton
            type="submit"
            text="login"
            className="bg-yellow-300 border-yellow-700 text-blue-800 mx-auto"
          />
        </div>
      </form>
    </div>
  );
}
