"use server";

import { createSession } from "@/partials/auth";
import { redirect } from "next/navigation";
import { getUser } from "../../partials/auth";
import { useUser } from "../components/context-wrappers/UserInfo";
import LostPasswordLogin from "../components/form/LostPasswordForm";
import LoginForm from "../components/form/LoginForm";
import GeneralButton from "../components/GeneralButton";
import Link from "next/link";
import LostPasswordForm from "../components/form/LostPasswordForm";
export default async function ForgotPassword() {
  return (
    <>
      <LostPasswordForm />
    </>
  );
}
