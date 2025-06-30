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

// async function getLikedPosts(usersId) {
//   try {
//     const likedPosts = await axios.post(
//       `${conf.baseFetchUrl}/api/posts/get-users-liked-posts`,
//       {
//         usersId,
//       },
//     );
//     return likedPosts;
//   } catch (error) {
//     console.error("Error fetching data for likedPosts in Dashboard:", error);
//     return [];
//   }
// }

// async function getSubmittedPosts(usersId) {
//   try {
//     const submittedPosts = await axios.post(
//       `${conf.baseFetchUrl}/api/posts/get-users-submitted-posts`,
//       {
//         usersId,
//       },
//     );
//     return submittedPosts;
//   } catch (error) {
//     console.error("Error fetching data for submittedPosts in Dashboard", error);
//     return [];
//   }
//   [];
// }

//get all posts likedByUser, return count
//get all posts submitted by user, return count

export default async function Home() {
  const myCookie = await cookies();
  const sessionCookie = myCookie.get("session");
  if (!sessionCookie || !sessionCookie.value) {
    console.log("no session cookie found");
    return;
  }
  const user = await getUser(sessionCookie.value);
  const usersId = user.$id || null;

  let submittedGeneralPostsCount = await getUsersSubmittedGeneralPostsCount(
    usersId,
  );
  let likedGeneralPostsCount = await getUsersLikedByGeneralPostsCount(usersId);

  const tagList = await getTags()
    .then((data) => data)
    .catch((error) => console.error("An error occured in tagList", error));
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
        <Suspense>
          <DashBoardContentSections
            likedGeneralPostsCount={likedGeneralPostsCount}
            submittedGeneralPostsCount={submittedGeneralPostsCount}
            categoriesAndTags={categoriesAndTags}
            tagList={tagList}
            usersId={usersId}
          />
        </Suspense>
      </main>
    </div>
  );
}
