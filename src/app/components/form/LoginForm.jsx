"use client";

import React, { useEffect } from "react";
import { createSession, getUser } from "@/partials/auth";
import { useUser } from "../../components/context-wrappers/UserInfo";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import GeneralButton from "../GeneralButton";

export default function LoginForm() {
  let userInfo = useUser();
  let { currentUsersInfo, setTriggerRecheck, triggerRecheck } = userInfo;

  const [state, action, isPending] = useActionState(createSession, null);
  console.log(`this is isPending ${isPending}`);

  //if user is already signed in, redirect to dashboard
  // once user is signed in, redirect to dashboard (thus why we're listening for triggerRecheck to change)
  const router = useRouter();

  useEffect(() => {
    async function checkIfUserIsLoggedIn() {
      let loggedIn = await getUser();

      if (loggedIn) {
        router.push("/dashboard");
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
    <div className="mx-auto p-4 max-w-md bg-blue-950 text-white mt-6">
      <form
        action={action}
        id="login-form"
      >
        <div className="">
          <label
            className=""
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full my-2 px-2"
            placeholder="Enter your email"
            defaultValue="test@gmail.com"
          />
        </div>
        <div>
          <label
            className=""
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            className="w-full my-2 pl-2"
            placeholder="Enter your password"
            defaultValue="testtest"
          />
        </div>
        <div className="flex">
          <GeneralButton
            type="submit"
            text="login"
            className="bg-yellow-300 border-yellow-700 text-blue-950 mx-auto "
          />
        </div>
      </form>
    </div>
  );
}
