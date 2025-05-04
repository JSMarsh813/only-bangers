"use server";
import PostList from "../components/posts/PostList";
import axios from "axios";
import { Suspense } from "react";
import header from "../../../public/space.jpg";

import Image from "next/image";
import conf from "@/config/envConfig";
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
// import { getQueryClient } from "../components/react-query/GetQueryClient";
import Link from "next/link";
import GeneralButton from "../components/GeneralButton";
import ContentWarning from "../components/ContentWarning";

function LoadingPosts() {
  const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;
  return (
    <div className="col-span-4 space-y-4 lg:col-span-1 min-h-screen w-full mt-20">
      <div className={`relative h-[167px] rounded-xl bg-gray-900 ${shimmer}`} />
      <div className="h-4 w-full rounded-lg bg-gray-900" />
      <div className="h-6 w-1/3 rounded-lg bg-gray-900" />
      <div className="h-4 w-full rounded-lg bg-gray-900" />
      <div className="h-4 w-4/6 rounded-lg bg-gray-900" />
    </div>
  );
}

async function getCategories() {
  //categories will not change so we are caching it
  "use cache";
  try {
    const categoriesAndTagsData = await axios.get(
      `${conf.baseFetchUrl}/api/categories-with-tags`,
    );
    const { categoriesAndTags } = categoriesAndTagsData.data;
    return categoriesAndTags;
  } catch (error) {
    console.error(
      "Error fetching data for categories and tags  in Dashboard:",
      error,
    );
    return [];
  }
  [];
}

async function getTags() {
  //tags will not change so we are caching it
  "use cache";
  try {
    let tagsDataForNewPostForm = await axios.get(
      `${conf.baseFetchUrl}/api/tags`,
    );

    let { tagList } = await tagsDataForNewPostForm.data;
    return tagList;
  } catch (error) {
    console.error("Error fetching data getTags on root page:", error);
    return [];
  }
}

async function getPostCount() {
  //tags will not change so we are caching it

  try {
    let postCountData = await axios.get(
      `${conf.baseFetchUrl}/api/posts/get-posts-count`,
    );
    //it gets send at a response object, so we're grabbing thh data from it that we need
    let { postCount } = await postCountData.data;
    console.log(postCountData);
    console.log(postCount);
    return postCount.count;
  } catch (error) {
    console.error("Error fetching data get-posts-count on root page:", error);
    return [];
  }
}

export default async function Home() {
  // const queryClient = getQueryClient();

  // // Prefetch deterministic data
  // await queryClient.prefetchQuery(["categories"], getCategories);
  // await queryClient.prefetchQuery(["tags"], getTags);

  const tagList = await getTags();
  const categoriesList = await getCategories();
  const countOfPosts = await getPostCount();

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
            {" "}
            General Tips
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
            categoriesAndTags={categoriesList}
            tagList={tagList}
            countOfPosts={countOfPosts}
          />
        </Suspense>
      </main>
    </div>
  );
}
