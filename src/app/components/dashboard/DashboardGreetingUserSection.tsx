"use client";

import React from "react";
import Image from "next/image";
import header from "../../../../public/space.jpg";
import DashboardPostsStatssection from "./DashboardPostsStatsSection";
import { useUser } from "../context-wrappers/UserInfo";

type DashboardGreetingUserSectionTypes = {
  likedGeneralPostsCount: number;
  submittedGeneralPostsCount: number;
};
export default function DashboardGreetingUserSection({
  likedGeneralPostsCount,
  submittedGeneralPostsCount,
}: DashboardGreetingUserSectionTypes) {
  const { currentUsersInfo, setTriggerRecheck, triggerRecheck } = useUser();

  return (
    <div className="h-[450px] sm:h-[198px] w-full relative ">
      <Image
        unoptimized
        src={header}
        alt=""
        sizes="100vw"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div className="absolute w-11/12 sm:w-3/4 bg-opacity-80 top-10 bg-blue-950 mx-auto  text-white  inset-0 font-extrabold h-fit border-4 rounded-3xl p-4 border-white">
        <h1 className="text-center text-xl bg-blue-800 rounded-3xl py-4 text-wrap">
          {`Welcome ${currentUsersInfo?.user_name || "error! no name found"}!`}
        </h1>

        <section className="mt-4 text-center grid-cols-1 grid sm:grid-cols-2 xl:grid-cols-4 gap-4 ">
          <DashboardPostsStatssection
            title="General Resources"
            likedCount={likedGeneralPostsCount}
            submittedCount={submittedGeneralPostsCount}
          />
          <DashboardPostsStatssection
            title="Technical Resources"
            likedCount={0}
            submittedCount={0}
          />
          <DashboardPostsStatssection
            title="Ai Resources"
            likedCount={0}
            submittedCount={0}
          />
          <DashboardPostsStatssection
            title="Community Finder"
            likedCount={0}
            submittedCount={0}
          />
        </section>
      </div>
    </div>
  );
}
