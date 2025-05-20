"use server";
import PostList from "../components/posts/PostList";

import { Suspense } from "react";
import header from "../../../public/space.jpg";
import {
  getTags,
  getCategoriesAndTags,
  getPostCount,
} from "../../server-actions/grabData/grabbingData";

import Image from "next/image";

import Link from "next/link";
import GeneralButton from "../components/GeneralButton";
import ContentWarning from "../components/ContentWarning";

function LoadingPosts() {
  const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;
  return (
    <div className="col-span-4 space-y-4 lg:col-span-1 min-h-screen w-full mt-20">
      <p className="text-white bg-blue-950"> Loading posts... </p>
      <div className={`relative h-[167px] rounded-xl bg-gray-900 ${shimmer}`} />
      <div className="h-4 w-full rounded-lg bg-gray-900" />
      <div className="h-6 w-1/3 rounded-lg bg-gray-900" />
      <div className="h-4 w-full rounded-lg bg-gray-900" />
      <div className="h-4 w-4/6 rounded-lg bg-gray-900" />
    </div>
  );
}

export default async function Home() {
  // const queryClient = getQueryClient();

  // // Prefetch deterministic data
  // await queryClient.prefetchQuery(["categories"], getCategories);
  // await queryClient.prefetchQuery(["tags"], getTags);

  const tagList = await getTags()
    .then((data) => data)
    .catch((error) => console.error("An error occured in tagList", error));
  const categoriesAndTags = await getCategoriesAndTags()
    .then((data) => data)
    .catch((error) =>
      console.error("An error occured in categoriesList", error),
    );
  const countOfPosts = await getPostCount()
    .then((data) => data)
    .catch((error) => console.error("An error occured in PostCount", error));

  return (
    <div className="bg-100devs min-h-screen">
      <main className="text-center">
        <div className=" h-36 w-full relative ">
          <Image
            src={header}
            alt=""
            sizes="100vw"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <h1 className="absolute text-white text-4xl inset-0 top-[40%] font-extrabold">
            General Resources
          </h1>
        </div>
        <p className="bg-blue-950 text-white py-4 text-lg">
          Find general tips that are not focused on a specific programming
          language
        </p>
        <ContentWarning />
        <section className="flex justify-center gap-4 px-2 bg-blue-800 border-b-2 border-white">
          <p className="text-white py-4 my-auto">
            Interested in Submitting Content?
          </p>

          <Link
            href="/general-submission"
            className="hover:text-blue-200 transition-colors"
          >
            <GeneralButton
              text="Go to Submissions"
              className=" bg-yellow-200  text-blue-900 border-yellow-600"
              type="button"
            />
          </Link>
        </section>

        <Suspense fallback={<LoadingPosts />}>
          <PostList
            swrApiPath="posts/get-all-posts"
            categoriesAndTags={categoriesAndTags}
            tagList={tagList}
            countOfPosts={countOfPosts}
          />
        </Suspense>
      </main>
    </div>
  );
}
