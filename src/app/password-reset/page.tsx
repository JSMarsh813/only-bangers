"use server";

import { Suspense } from "react";
import FinishPasswordRecoveryForm from "../components/form/FinishPasswordRecoveryForm";

//https://stackoverflow.com/questions/79178658/how-to-get-url-params-in-next-js-15-on-the-server-side

//search params is async, so its a promise thats has to be awaited
type PasswordResetTypes = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};
//allows for multiple search params
// the keys will always be a string
///my-page?name=john  &age=25  &tags=react&tags=js  &city
// const searchParams: SearchParams = {
//   name: "john",           // string
//   age: "25",             // string
//   tags: ["react", "js"],  // string[]
//   city: undefined        // undefined (optional)
// };
//
export default async function PasswordReset({
  searchParams,
}: PasswordResetTypes) {
  const { userId, secret } = await searchParams;

  //###############  if not valid  ###############
  if (typeof userId !== "string" || typeof secret !== "string") {
    return (
      <div className="p-4 bg-red-900 text-white mx-auto max-w-lg">
        <h1 className="block w-fit mx-auto text-xl font-semibold">
          Invalid Password Reset Link
        </h1>
        <p className="my-2">
          The password reset link is invalid or expired. Please request a new
          one.
        </p>
      </div>
    );
  }

  //###############  if valid  ###############
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
