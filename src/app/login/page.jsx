"use server";

import { createSession } from "@/partials/auth";
import { redirect } from "next/navigation";
import { getUser } from "../../partials/auth";
import { useUser } from "../components/context-wrappers/UserInfo";
import LoginForm from "../components/form/LoginForm";
export default async function () {
  //if user is already signed in, redirect to dashboard

  return (
    <div>
      <LoginForm />
    </div>
  );
}
