"use client";

import React, { useEffect } from "react";
import { createSession, getUser } from "@/partials/auth";
import { useUser } from "../context-wrappers/UserInfo";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import GeneralButton from "../GeneralButton";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function LoginForm() {
  const userInfo = useUser();
  const { currentUsersInfo, setTriggerRecheck, triggerRecheck } = userInfo;

  const [state, action, isPending] = useActionState(createSession, null);
  // state: holds the current result of the action or error
  // action: a dispatcher to trigger the action function  (createSession in this case)
  // isPending indicates if the action is in-flight (in-flight = currently in progress or active)

  // createSession is the action function provided to useActionState
  // null is the intial state

  console.log(`this is isPending ${isPending}`);

  useAuthRedirect(getUser, "/dashboard", triggerRecheck);

  // useEffect(() => {
  //   async function checkIfUserIsLoggedIn() {
  //     const loggedIn = await getUser();

  //     if (loggedIn) {
  //       router.push("/dashboard");
  //     }
  //   }
  //   checkIfUserIsLoggedIn();
  // }, [triggerRecheck]);

  useEffect(() => {
    // if the login form was successfully submitted, aka is not pending, then we want to recheck for the users info, so update useContext
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
