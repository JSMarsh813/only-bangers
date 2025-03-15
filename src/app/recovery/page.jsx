"use client";

import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";
import FinishPasswordRecoveryForm from "../components/form/FinishPasswordRecoveryForm";

export default function ({ params }) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  //if user is already signed in, redirect to dashboard

  return (
    <div className="p-4 bg-blue-900 text-white mx-auto max-w-lg flex flex-wrap">
      <h1 className="block w-fit mx-auto text-xl font-semibold">
        {" "}
        Password Reset{" "}
      </h1>
      <p className="my-2">
        Once you reset your password, you will automatically be redirected to
        the login page to sign in
      </p>
      <FinishPasswordRecoveryForm
        userId={userId}
        secret={secret}
      />
    </div>
  );
}
