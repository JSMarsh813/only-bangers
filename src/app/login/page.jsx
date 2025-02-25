"use server";

import { createSession } from "@/partials/auth";
import { redirect } from "next/navigation";
import { getUser } from "../../partials/auth";

export default async function () {
  //if user is already signed in, redirect to dashboard
  const user = await getUser();
  if (user) redirect("/dashboard");
  return (
    <div>
      <form
        action={createSession}
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
            defaultValue="dennis@email.com"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password..."
            defaultValue="password123"
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
