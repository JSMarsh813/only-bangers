"use client";

import React from "react";
import { createRecoveryPassword } from "../../../server-actions/resetPassword";
import { useActionState } from "react";
import GeneralButton from "../GeneralButton";

export default function LostPasswordForm() {
  const [state, action, isPending] = useActionState(
    createRecoveryPassword,
    null,
  );

  return (
    <section className="bg-white">
      <span> forgot password? </span>
      <form action={action}>
        <label htmlFor="email">
          Enter the email associated with your account{" "}
        </label>
        <input
          id="email"
          name="email"
          type="email"
        ></input>
        <GeneralButton
          type="submit"
          text="reset password"
          className="bg-yellow-300"
        />
      </form>
    </section>
  );
}
