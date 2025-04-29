"use server";
import PostList from "./components/posts/PostList";
import axios from "axios";
import { Suspense } from "react";
import header from "../../public/space.jpg";
import SectionForNewFormButtonAndForm from "./components/SectionForNewFormButtonAndForm";
import Image from "next/image";
import conf from "@/config/envConfig";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "./components/react-query/GetQueryClient";
import Link from "next/link";
import GeneralButton from "./components/GeneralButton";

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

    let { tagList } = tagsDataForNewPostForm.data;
    return tagList;
  } catch (error) {
    console.error("Error fetching data getTags on root page:", error);
    return [];
  }
}

export default async function Home() {
  let tagList = await getTags();
  const queryClient = getQueryClient();

  // async function getPosts() {
  //The prefetchQuer method works the same as fetchQuery except that it will not throw or return any data
  //so we CAN"T grab the prefetch posts and pass it as a prop to the postLists component even if we wanted to
  //instead in postsLists, we use reactQuery to grab these posts which has been added to the queryKey "posts"

  // const fetchFirstPosts = async function () {
  //   let postsData = await axios.post(`${conf.baseFetchUrl}/api/posts/`, {
  //     pageNumber: 0,
  //     notFirstPage: false,
  //     lastId: null,
  //   });
  //   let { posts } = await postsData.data;

  //   return posts;
  // };
  // try {
  //   await queryClient.prefetchQuery({
  //     queryKey: ["posts"],
  //     queryFn: () => fetchFirstPosts(),
  //   });
  // } catch (error) {
  //   console.error("Error fetching data getPosts on root page:", error);
  //   return [];
  // }

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

        <p className="bg-blue-800 text-white py-4 border-t-2 border-white">
          Interested in Submitting Content? Click the button below to be
          redirected to the submission page
        </p>
        <Suspense>
          <Link
            href="/general-submission"
            className="flex  justify-center hover:text-blue-200 transition-colors"
          >
            <GeneralButton
              text="Go to Submissions"
              className="mx-auto bg-yellow-200 text-blue-900 border-yellow-600"
              type="button"
            />
          </Link>
        </Suspense>

        <Suspense fallback={<LoadingPosts />}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <PostList
              categoriesAndTags={await getCategories()}
              tagList={tagList}
            />
          </HydrationBoundary>
        </Suspense>
      </main>
    </div>
  );
}
