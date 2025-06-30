"use client";

import React from "react";
import Image from "next/image";
import header from "../../../../public/space.jpg";

import { useUser } from "../context-wrappers/UserInfo";

export default function DashboardGreetingUserSection({
  likedGeneralPostsCount,
  submittedGeneralPostsCount,
}) {
  const { currentUsersInfo, setTriggerRecheck, triggerRecheck } = useUser();

  return (
    <div className=" h-[198px] w-full relative ">
      <Image
        unoptimized
        src={header}
        alt=""
        sizes="100vw"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div className="absolute w-11/12 sm:w-3/4 bg-opacity-80 top-10 bg-blue-950 mx-auto text-white  inset-0 font-extrabold h-[300px] border-4 rounded-3xl p-4 border-white">
        <h1 className="text-center text-2xl bg-blue-800 rounded-3xl py-4">
          {`Welcome ${
            currentUsersInfo?.user_name || "error! no username found"
          }!`}
        </h1>
        <h4> Stats </h4>

        <span className="block">Liked: {likedGeneralPostsCount || 0}</span>
        <span className="block">
          Submitted: {submittedGeneralPostsCount || 0}
        </span>
      </div>
    </div>
  );
}
