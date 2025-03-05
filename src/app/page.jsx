import PostList from "./components/posts/PostList";
import axios from "axios";
import { Suspense } from "react";
import header from "../../public/space.jpg";
import SectionForNewFormButtonAndForm from "./components/SectionForNewFormButtonAndForm";
import Image from "next/image";
import conf from "../config/envConfig";

export const dynamic = "force-dynamic";

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

export default async function Home() {
  const postsData = await axios.get(`${conf.baseFetchUrl}/api/posts`);
  const { posts } = postsData.data;

  const categoriesAndTagsData = await axios.get(
    `${conf.baseFetchUrl}/api/categories-with-tags`,
  );
  const { categoriesAndTags } = categoriesAndTagsData.data;

  const tagsDataForNewPostForm = await axios.get(
    `${conf.baseFetchUrl}/api/tags`,
  );
  const { tagList } = tagsDataForNewPostForm.data;

  return (
    <div className="">
      <main className="text-center">
        <Suspense fallback={<LoadingPosts />}>
          <div className=" h-36 w-full relative ">
            <Image
              unoptimized
              src={header}
              alt=""
              sizes="100vw"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            <h1 className="absolute text-white text-4xl inset-0 top-[40%] font-extrabold">
              {" "}
              Posts{" "}
            </h1>
          </div>

          <SectionForNewFormButtonAndForm tags={tagList} />
          <PostList
            initialPosts={posts}
            categoriesAndTags={categoriesAndTags}
          />
        </Suspense>
      </main>
    </div>
  );
}
