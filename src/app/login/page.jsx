"use server";

import { createSession } from "@/partials/auth";
import { redirect } from "next/navigation";
import { getUser } from "../../partials/auth";
import { useUser } from "../components/context-wrappers/UserInfo";
import LostPasswordLogin from "../components/form/LostPasswordForm";
import LoginForm from "../components/form/LoginForm";
import GeneralButton from "../components/GeneralButton";
import Link from "next/link";
export default async function () {
  //if user is already signed in, redirect to dashboard

  return (
    <div>
      <LoginForm />
      <section className="bg-blue-900 border-t-4 py-6 border-white text-white mx-auto max-w-md flex gap-4 justify-center">
        <h2 className="inline-block w-fit font-semibold text-base my-auto">
          Forgot Your Password?{" "}
        </h2>

        <Link href="/forgot-password">
          <span className="bg-yellow-300 font-semibold inline-block p-2 rounded-xl text-blue-800 border-b-4 border-yellow-700 hover:bg-white hover:border-blue-600">
            recover account
          </span>
        </Link>
      </section>
    </div>
  );
}
