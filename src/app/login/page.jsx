"use server";

import LoginForm from "../components/form/LoginForm";

import Link from "next/link";
import Image from "next/image";
export default async function () {
  //if user is already signed in, redirect to dashboard

  return (
    <div>
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
          Login
        </h1>
      </div>

      <LoginForm />
      <section className="bg-blue-950 border-t-4 py-6 border-white text-white mx-auto max-w-md flex gap-4 justify-center">
        <h2 className="inline-block w-fit font-semibold text-base my-auto">
          Forgot Your Password?{" "}
        </h2>

        <Link href="/forgot-password">
          <span className="bg-yellow-300 font-semibold inline-block p-2 rounded-xl text-blue-950 border-b-4 border-yellow-700 hover:bg-white hover:border-blue-600">
            recover account
          </span>
        </Link>
      </section>
    </div>
  );
}
