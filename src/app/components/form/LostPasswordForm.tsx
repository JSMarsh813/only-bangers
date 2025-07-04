"use client";

import React, { useState, useEffect } from "react";
import { createRecoveryPassword } from "../../../server-actions/emailResetPasswordLink";
import { useActionState } from "react";
import GeneralButton from "../GeneralButton";
import ToggeableAlert from "../ToggeableAlert";

export default function LostPasswordForm() {
  const [showNotification, setShowNotification] = useState(false);
  const [state, action, isPending] = useActionState(
    createRecoveryPassword,
    null,
  );

  useEffect(() => {
    if (state !== null) {
      setShowNotification(true);
    }
  }, [state]);

  return (
    <section className="bg-blue-900 text-white mx-auto max-w-md p-4">
      <h2 className="mx-auto w-fit text-2xl pb-4">Forgot Your Password? </h2>
      <form action={action}>
        <label
          htmlFor="email"
          className="block mb-2"
        >
          Enter the email associated with your account{" "}
        </label>
        <input
          id="email"
          name="email"
          className="w-full px-2 "
          type="email"
        ></input>

        <GeneralButton
          type="submit"
          text="reset password"
          className="bg-yellow-300 border-yellow-700 text-blue-800 mx-auto"
        />
      </form>
      {showNotification && (
        <ToggeableAlert
          text={state?.messageToUser || "an error occured"}
          successfulOrNot={true}
          setToggleState={setShowNotification}
          toggleState={showNotification}
        />
      )}
    </section>
  );
}
