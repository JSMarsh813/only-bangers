"use server";

import { createSession } from "@/partials/auth";
import { redirect } from "next/navigation";
import { getUser } from "../../partials/auth";
import { useUser } from "../components/context-wrappers/UserInfo";
import LostPasswordLogin from "../components/form/LostPasswordForm";
import LoginForm from "../components/form/LoginForm";
import GeneralButton from "../components/GeneralButton";
export default async function () {
  //if user is already signed in, redirect to dashboard

  return (
    <div>
      <LostPasswordLogin />
    </div>
  );
}
