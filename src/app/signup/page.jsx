"use server";

import React from "react";
import { redirect } from "next/navigation";
import { getUser, signUpWithEmail } from "@/partials/auth";
import Image from "next/image";
import RequiredSpan from "../components/form/RequiredSpan";
import GeneralButton from "../components/GeneralButton";
import WideDivider from "../components/WideDivider";

export default async function SignUpPage() {
  //if user is already signed in, redirect to dashboard
  const user = await getUser();
  if (user) redirect("/dashboard");

  const listOfText = [
    "Like posts",
    "View your liked posts",
    "View your submitted posts",
    "Your personalized list of saved post or created posts has a filtering sidebar available, so you can quickly find the resource you're looking for",
    "Submit content",
    "Flag posts for concerns or suggest edits ",
  ];

  return (
    <>
      <div className=" h-40 w-full relative ">
        <Image
          src="/space.jpg"
          alt=""
          sizes="100vw"
          fill
          style={{ objectFit: "cover" }}
          priority
          unoptimized
        />
        <h1 className="absolute text-white text-3xl max-w-[130px] mx-auto inset-0 top-[30%] font-extrabold">
          Sign Up
        </h1>
      </div>

      <WideDivider heading="Welcome to the team!" />
      <section className="bg-blue-800 text-white pb-4 mb-4">
        <p className="mx-auto max-w-[550px] p-4 text-center">
          By creating a free account you'll unlock these time-saving features:
        </p>

        <ul className=" max-w-[800px] mx-auto pb-8 pl-6 text-left border-y-2 p-4 border-white my-2 ">
          {listOfText.map((sentence) => (
            <li key={sentence}>
              <p> ✅ {sentence} </p>
            </li>
          ))}
        </ul>
      </section>
      <form
        action={signUpWithEmail}
        className=" mx-auto bg-blue-950 rounded-lg w-[94vw] text-center text-white pt-2"
      >
        <fieldset className="my-6">
          <label
            className="font-bold mt-4  bg-blue-800 banner text-white"
            htmlFor="email"
          >
            Email
          </label>
          <RequiredSpan />
          <input
            id="email"
            name="email"
            placeholder="Email"
            type="email"
            className="w-4/6 text-black"
            required
          />
        </fieldset>

        <fieldset className="my-6">
          <label
            className="font-bold mt-4  bg-blue-800 banner text-white"
            htmlFor="password"
          >
            Password
          </label>
          <RequiredSpan />
          <input
            id="password"
            name="password"
            placeholder="Password"
            minLength={8}
            type="password"
            className="w-4/6 text-black"
            required
          />
        </fieldset>

        <fieldset className="my-6">
          <label
            className="font-bold mt-4 bg-blue-800 banner text-white"
            htmlFor="name"
          >
            User Name
          </label>
          <RequiredSpan />
          <input
            id="name"
            name="name"
            placeholder="Name"
            type="text"
            className="w-4/6 text-black"
            required
          />
        </fieldset>
        <GeneralButton
          text="Sign Up"
          type="submit"
          className="mx-auto bg-yellow-300 text-blue-950 border-yellow-700"
        />
      </form>
    </>
  );
}
