"use server";

import LostPasswordLogin from "../components/form/LostPasswordForm";

export default async function LostPasswordPage() {
  //if user is already signed in, redirect to dashboard

  return (
    <div>
      <LostPasswordLogin />
    </div>
  );
}
