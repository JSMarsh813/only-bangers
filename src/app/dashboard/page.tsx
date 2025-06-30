"use server";
import { cookies } from "next/headers";
import { getUser } from "@/partials/auth";

import DashBoardContentSections from "../components/dashboard/DashboardContentSections";

import { Suspense } from "react";
import DashboardGreetingSection from "../components/dashboard/DashboardGreetingUserSection";

import {
  getCategoriesAndTags,
  getTags,
  getUsersLikedByGeneralPostsCount,
  getUsersSubmittedGeneralPostsCount,
} from "@/server-actions/grabData/grabbingData";
import LoadingSpinner from "../components/LoadingSpinner";

export default async function Home() {
  const user = await getUser();

  if (!user || !user?.$id) {
    //the middleware file is responsible for redirecting users that are not signed in away from the dashboard
    //however this typeguard && return is necessary so typescript won't freak out about user.$id
    return;

    // the type guard alone isn't enough to keep typescript from freaking about a null user.$id somehow slipping through the check

    //the return above was necessary for typescript to not panic and think userId could still be null below

    // exiting early with return makes the type narrowing permanent in the rest of the function
  }

  const usersId: string = user.$id;

  const submittedGeneralPostsCount = await getUsersSubmittedGeneralPostsCount(
    usersId,
  );
  const likedGeneralPostsCount = await getUsersLikedByGeneralPostsCount(
    usersId,
  );

  const tagList = await getTags()
    .then((data) => data)
    .catch((error) => {
      console.error("An error occured in tagList", error);
      return [];
    });

  const categoriesAndTags = await getCategoriesAndTags()
    .then((data) => data)
    .catch((error) => {
      console.error("An error occured in categoriesList", error);
      return [];
    });

  return (
    <div className="bg-blue-800 min-h-screen">
      <DashboardGreetingSection
        submittedGeneralPostsCount={submittedGeneralPostsCount}
        likedGeneralPostsCount={likedGeneralPostsCount}
      />
      <main className="text-center mt-[150px]">
        <Suspense fallback={<LoadingSpinner />}>
          <DashBoardContentSections
            likedGeneralPostsCount={likedGeneralPostsCount}
            submittedGeneralPostsCount={submittedGeneralPostsCount}
            categoriesAndTags={categoriesAndTags}
            tagList={tagList}
          />
        </Suspense>
      </main>
    </div>
  );
}
