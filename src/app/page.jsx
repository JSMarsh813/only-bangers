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
async function getPosts() {
  try {
    let postsData = await axios.get(`${conf.baseFetchUrl}/api/posts`);
    let { posts } = postsData.data;
    return posts;
  } catch (error) {
    console.error("Error fetching data getPosts on root page:", error);
    return [];
  }
}

export default async function Home() {
  const queryClient = getQueryClient();
  console.log(queryClient);

  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      let postsData = await axios.get(
        `${conf.baseFetchUrl}/api/posts/prefetch-posts`,
      );
      let { posts } = postsData.data;
      return posts;
    },
  });
  let tagList = await getTags();
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
        <p className="bg-blue-900 text-white py-4">
          Find general tips that are not focused on a specific programming
          language
        </p>
        <Suspense>
          <SectionForNewFormButtonAndForm tags={tagList} />
        </Suspense>

        <Suspense fallback={<LoadingPosts />}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <PostList
              initialPosts={await getPosts()}
              categoriesAndTags={await getCategories()}
              tagList={tagList}
            />
          </HydrationBoundary>
        </Suspense>
      </main>
    </div>
  );
}
