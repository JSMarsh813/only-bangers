"use server";

import React from "react";
import Image from "next/image";
import WideDivider from "../components/WideDivider";
import SignUpForm from "../components/form/SignUpForm";

export default async function SignUpPage() {
  //if user is already signed in, redirect to dashboard

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
      <SignUpForm />
    </>
  );
}
