"use client";

import React, { useRef } from "react";

import GeneralButton from "../GeneralButton";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import confirmPasswordRecovery from "../../../server-actions/confirmPasswordRecovery";

export default function LostPasswordForm({ userId, secret }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({});
  const password = useRef({});
  password.current = watch("password", "");
  const onSubmit = async (data) => {
    alert(JSON.stringify(data));
    confirmPasswordRecovery(data);
  };
  const formData = new FormData();

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <section className="my-3">
        <label className="inline-block w-[8.5rem]">Password</label>
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
        <label className="inline-block w-[8.5rem]">Repeat password</label>
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
        className="bg-yellow-300 border-yellow-700 text-blue-800"
      />
    </form>
  );
}
