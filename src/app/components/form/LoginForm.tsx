"use client";

import React, { useEffect } from "react";
import { createSession } from "@/server-actions/auth";
import AlreadySignedInNotification from "./AlreadySignedInNotification";
import { useUser } from "../context-wrappers/UserInfo";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import GeneralButton from "../GeneralButton";
import { trackEvent, GtagAction, GtagCategory } from "@/lib/analytics/gtag";

import LoadingSpinner from "../LoadingSpinner";

export default function LoginForm() {
  const router = useRouter();
  const userInfo = useUser();
  const { currentUsersInfo, setTriggerRecheck, triggerRecheck } = userInfo;

  const [state, action, isPending] = useActionState(createSession, null);
  // state: holds the current result of the action or error
  // action: a dispatcher to trigger the action function  (createSession in this case)
  // isPending indicates if the action is in-flight (in-flight = currently in progress or active)

  // createSession is the action function provided to useActionState
  // null is the intial state

  //if context already has the users logged in information, then redirect to dashboard
  // if (currentUsersInfo?.user_name !== "guest") {
  //   router.push("/dashboard");
  // }

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
    //telling context to regrab context info after the user has logged in
    //  (aka grab their id and username)
    if (state !== null && isPending === false) {
      setTriggerRecheck(true);
    }
  }, [state, isPending, setTriggerRecheck]);

  useEffect(() => {
    const isSuccess =
      state !== null && // login was attempted
      isPending === false && // login attempt is done
      currentUsersInfo?.user_name !== "guest"; //login was successful
    //Example:
    // state undefined
    // isPending false
    // currentUsersInfo?.user_name ghiblimagic

    if (!isSuccess) return;

    trackEvent({
      action: GtagAction.SignupComplete,
      category: GtagCategory.Conversion,
      label: currentUsersInfo.user_name,
    });

    router.push("/dashboard");
  }, [currentUsersInfo, isPending, state, router]);
  // router is an object returned from useRouter and is unlikely to change, but ESLint will give a warning if its not included, because otherwise it won't satisfy the Rules Of Hooks
  // Adding router ensures the effect always has the latest reference in case React re-renders
  // objects and functions can change identity between renders even if they look the same, so having the latest reference/version to avoid any stale references and subtle bugs

  return (
    <div className="mx-auto p-4 max-w-md bg-blue-950 text-white mt-6">
      {state !== null && (
        <section>
          <p>{state.message}</p>
          <div className="flex justify-center">
            {state.success === true && <LoadingSpinner />}
          </div>
        </section>
      )}

      {currentUsersInfo.user_name !== "guest" && state?.success !== true && (
        <AlreadySignedInNotification
          currentUsersName={currentUsersInfo.user_name}
          setTriggerRecheck={setTriggerRecheck}
        />
      )}

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
            disabled={currentUsersInfo?.user_name !== "guest"}
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
            disabled={currentUsersInfo?.user_name !== "guest"}
          />
        </div>
        <div className="flex">
          <GeneralButton
            onClick={() =>
              trackEvent({
                action: GtagAction.LoginClick,
                category: GtagCategory.Engagement,
                label: "login_button",
              })
            }
            type="submit"
            text="login"
            className="bg-yellow-300 border-yellow-700 text-blue-950 mx-auto "
            disabled={
              state?.success === true || currentUsersInfo?.user_name !== "guest"
            }
          />
        </div>
      </form>
    </div>
  );
}
