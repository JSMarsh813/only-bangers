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
    <div className="mx-2 p-4 bg-blue-800 text-white ">
      <h1> Password Reset </h1>
      <FinishPasswordRecoveryForm
        userId={userId}
        secret={secret}
      />
    </div>
  );
}
