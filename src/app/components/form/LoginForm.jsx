"use client";

import React, { useEffect } from "react";
import { createSession, getUser } from "@/partials/auth";
import { useUser } from "../../components/context-wrappers/UserInfo";
import { useActionState } from "react";
import { redirect } from "next/navigation";

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
    <div>
      <span> {`this is ${isPending}`} </span>
      <span> {`this is ${state}`} </span>
      <form
        action={action}
        id="login-form"
      >
        <h3>Login</h3>
        <p>Enter your information to create an account</p>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email..."
            defaultValue="test@gmail.com"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password..."
            defaultValue="testtest"
          />
        </div>
        <div>
          <input
            type="submit"
            value={"Login"}
          />
        </div>
      </form>
    </div>
  );
}
