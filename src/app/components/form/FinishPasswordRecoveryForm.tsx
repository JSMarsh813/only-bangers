"use client";

import React, { useRef, useState } from "react";

import GeneralButton from "../GeneralButton";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import confirmPasswordRecovery from "../../../server-actions/confirmPasswordRecovery";
import { useRouter } from "next/navigation";
import ToggeableAlert from "../ToggeableAlert";

export default function LostPasswordForm({
  userId,
  secret,
}: {
  userId: string;
  secret: string;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<PasswordRecoveryFormValues>({});
  //useForm<Specify the layout of your data here>({});
  // this ensures all react hook for helpers: register, formState, handleSubmit, etc., are all properly typed for your custom fields.
  //prevents TypeScript errors when you use a typed onSubmit Handler

  const [messageToShowUser, setMessageToShowUser] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [successfulOrNot, setSuccessfulOrNot] = useState<boolean>(false);

  const password = useRef({});
  password.current = watch("password", "");
  const router = useRouter();

  type PasswordRecoveryFormKeys =
    | "password"
    | "password_repeat"
    | "userId"
    | "secret";

  type PasswordRecoveryFormValues = {
    [K in PasswordRecoveryFormKeys]: string;
  };
  //saying each FormKey is a string
  const onSubmit: SubmitHandler<PasswordRecoveryFormValues> = async (data) => {
    const { messageToUser, messageForDev, status } =
      await confirmPasswordRecovery(data);

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
            type="password"
            {...register("password", {
              required: "this is required",
              minLength: {
                value: 8,
                message: "Password must have at least 8 characters",
              },
            })}
          />
          {/* https://react-hook-form.com/docs/useformstate/errormessage */}
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => (
              <p className="text-red-700 text-sm italic">{message} </p>
            )}
          />
        </section>
        <section>
          <label className="inline-block w-[9rem] mb-2 font-semibold">
            Repeat Password
          </label>
          <input
            type="password"
            {...register("password_repeat", {
              required: "this is required",
              validate: (value) =>
                value === password.current || "The passwords do not match",
            })}
          />
          <ErrorMessage
            errors={errors}
            name="password_repeat"
            render={({ message }) => (
              <p className="text-red-700 text-sm italic">{message} </p>
            )}
          />
        </section>

        <input
          type="hidden"
          value={userId}
          {...register("userId")}
        />

        {/*was getting this ts error:
         name' is specified more than once, so this usage will be overwritten.ts(2783) 
         
           <input
          type="hidden"
          name="userId"
          value={userId}
          {...register("userId")}
        />
        
        And here’s the catch: register("userId") from react-hook-form already includes a name property. So by also manually setting name="userId" in the JSX, you’re effectively doing:

        <input name="userId" name="userId" ... />
        */}
        <input
          type="hidden"
          value={secret}
          {...register("secret")}
        />

        <GeneralButton
          text="submit"
          type="submit"
          onClick={handleSubmit(onSubmit)}
          //had a typescript error
          // SubmitHandler<PasswordRecoveryFormValues>' is not assignable to parameter of type 'SubmitHandler<FieldValues>'.

          //Type 'FieldValues' is missing the following properties from type 'PasswordRecoveryFormValues': userId, secret, password, password_repeats

          //why? because useForm is using the default FieldValues type, which does not guarantee the presence of those custom fields
          //fix: tell useForm specifically what the data layout should look like:
          // useForm<PasswordRecoveryFormValues>({});
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
