"use client";

import React, { useEffect } from "react";
import { useActionState } from "react";
import { redirect } from "next/navigation";
import { getUser, signUpWithEmail } from "@/server-actions/auth";
import RequiredSpan from "./RequiredSpan";
import GeneralButton from "../GeneralButton";
import conf from "@/config/envConfig";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/components/context-wrappers/UserInfo";
import WarningNotice from "../WarningNotice";

export default function SignUpForm() {
  //if user is already signed in, redirect to dashboard
  const router = useRouter();
  const userInfo = useUser();
  const { currentUsersInfo, setTriggerRecheck, triggerRecheck } = userInfo;

  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);

  if (currentUsersInfo?.user_name !== "guest") redirect("/dashboard");

  // Trigger context recheck after successful signup
  useEffect(() => {
    if (state !== null && state?.success) {
      setTriggerRecheck(true);
    }
  }, [state, setTriggerRecheck]);

  console.log(`this is state ${JSON.stringify(state)}`);

  //redirect once the user has successfully signedup
  useEffect(() => {
    if (
      state !== null && //signup was attempted, null is the default state
      state?.success === true && // signup was done successfully
      isPending === false // signup attempt is no longer being processed
    ) {
      router.push("/dashboard");
    }
  }, [state, setTriggerRecheck]);

  return (
    <>
      <form
        action={formAction}
        className=" mx-auto bg-blue-950 rounded-lg w-[94vw] text-center text-white pt-2"
      >
        <fieldset className="my-6">
          <label
            className="font-bold mt-4  bg-blue-800 banner text-white"
            htmlFor="email"
          >
            Email
          </label>
          <RequiredSpan />
          <input
            id="email"
            name="email"
            placeholder="Email"
            type="email"
            className="w-4/6 text-black"
            required
          />
        </fieldset>

        <fieldset className="my-6">
          <label
            className="font-bold mt-4  bg-blue-800 banner text-white"
            htmlFor="password"
          >
            Password
          </label>
          <RequiredSpan />
          <input
            id="password"
            name="password"
            placeholder="Password"
            minLength={8}
            type="password"
            className="w-4/6 text-black"
            required
          />
        </fieldset>

        <fieldset className="my-6">
          <label
            className="font-bold mt-4 bg-blue-800 banner text-white"
            htmlFor="name"
          >
            User Name
          </label>
          <RequiredSpan />
          <input
            id="name"
            name="name"
            placeholder="Name"
            type="text"
            className="w-4/6 text-black"
            required
          />
        </fieldset>
        <GeneralButton
          text="Sign Up"
          type="submit"
          className="mx-auto bg-yellow-300 text-blue-950 border-yellow-700"
        />
      </form>

      {state?.success === false && (
        <WarningNotice
          text={`This email is already in use, if you need to reset your password please go to ${conf.baseFetchUrl}/forgot-password`}
          className="mt-4 mx-auto text-center w-4/5"
        />
      )}
    </>
  );
}
