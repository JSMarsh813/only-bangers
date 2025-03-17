"use client";

import React, { useRef, useState } from "react";

import GeneralButton from "../GeneralButton";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import confirmPasswordRecovery from "../../../server-actions/confirmPasswordRecovery";
import { useRouter } from "next/navigation";
import ToggeableAlert from "../ToggeableAlert";

export default function LostPasswordForm({ userId, secret }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({});

  let [messageToShowUser, setMessageToShowUser] = useState("");
  let [showAlert, setShowAlert] = useState(false);
  let [successfulOrNot, setSuccessfulOrNot] = useState("");

  const password = useRef({});
  password.current = watch("password", "");
  const router = useRouter();

  const onSubmit = async (data) => {
    let resetPassword = await confirmPasswordRecovery(data);

    let { messageToUser, messageForDev, status } = resetPassword;

    if (status === "error") {
      setMessageToShowUser(messageToUser);
      setShowAlert(true);
      setSuccessfulOrNot(false);
    } else {
      setShowAlert(true);
      setSuccessfulOrNot(true);
      setMessageToShowUser(messageToUser);

      router.push("/login");
    }
  };
  const formData = new FormData();

  return (
    <div className="w-full">
      <form onSubmit={(e) => e.preventDefault()}>
        <section className="my-3">
          <label className="inline-block w-[9rem] font-semibold">
            Password
          </label>

          <input
            name="password"
            type="password"
            {...register("password", {
              required: "this is required",
              minLength: {
                value: 8,
                message: "Password must have at least 8 characters",
              },
            })}
          />
          <ErrorMessage
            className="bg-red-700"
            errors={errors}
            name="password"
          />
        </section>
        <section>
          <label className="inline-block w-[9rem] mb-2 font-semibold">
            Repeat Password
          </label>
          <input
            name="password_repeat"
            type="password"
            {...register("password_repeat", {
              required: "this is required",
              validate: (value) =>
                value === password.current || "The passwords do not match",
            })}
          />
          <ErrorMessage
            className="bg-red-700"
            errors={errors}
            name="password_repeat"
          />
        </section>

        <input
          type="hidden"
          name="userId"
          value={userId}
          {...register("userId")}
        />
        <input
          type="hidden"
          name="secret"
          value={secret}
          {...register("secret")}
        />

        <GeneralButton
          text="submit"
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="bg-yellow-300 border-yellow-700 text-blue-800 mx-auto"
        />
      </form>
      {showAlert && (
        <ToggeableAlert
          text={messageToShowUser}
          successfulOrNot={successfulOrNot}
          setToggleState={setShowAlert}
          toggleState={showAlert}
        />
      )}
    </div>
  );
}
