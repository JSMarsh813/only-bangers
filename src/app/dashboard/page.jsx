"use server";
import { cookies } from "next/headers";
import { getUser } from "@/partials/auth";
import axios from "axios";
import header from "../../../public/space.jpg";
import conf from "@/config/envConfig";
import DashBoardContentSections from "../components/dashboard/DashboardContentSections";
import Image from "next/image";
import { Suspense } from "react";

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
    .catch((error) =>
      console.error("An error occured in categoriesList", error),
    );

  return (
    <div className="bg-blue-800 min-h-screen">
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
            Welcome User!
          </h1>
          <h4> Stats </h4>
          <Suspense>
            <span className="block">
              Liked: {likedGeneralPostsCount || "0"}
            </span>
            <span className="block">
              Submitted: {submittedGeneralPostsCount || "0"}
            </span>
          </Suspense>
        </div>
      </div>

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
