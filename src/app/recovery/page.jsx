"use server";

import { Suspense } from "react";
import FinishPasswordRecoveryForm from "../components/form/FinishPasswordRecoveryForm";

export default async function ({ params, searchParams }) {
  const { userId, secret } = await searchParams;

  return (
    <div className="p-4 bg-blue-900 text-white mx-auto max-w-lg flex flex-wrap">
      <h1 className="block w-fit mx-auto text-xl font-semibold">
        Password Reset{" "}
      </h1>
      <p className="my-2">
        Once you reset your password, you will automatically be redirected to
        the login page to sign in
      </p>
      <Suspense>
      <FinishPasswordRecoveryForm
        userId={userId}
        secret={secret}
      />
      </Suspense>
    </div>
  );
}
