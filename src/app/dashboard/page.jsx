"use server";
import { cookies } from "next/headers";
import { getUser } from "@/partials/auth";
import axios from "axios";
import header from "../../../public/space.jpg";
import conf from "@/config/envConfig";
import DashBoardContentSections from "../components/dashboard/DashboardContentSections";
import Image from "next/image";

export default async function Home() {
  const myCookie = await cookies();
  const sessionCookie = myCookie.get("session");
  const user = await getUser(sessionCookie.value);
  const usersId = user.$id;
  const likedPosts = await axios.post(
    `${conf.baseFetchUrl}/api/posts/get-users-liked-posts`,
    {
      usersId,
    },
  );
  const submittedPosts = await axios.post(
    `${conf.baseFetchUrl}/api/posts/get-users-submitted-posts`,
    {
      usersId,
    },
  );

  const categoriesAndTagsData = await axios.get(
    `${conf.baseFetchUrl}/api/categories-with-tags`,
  );
  const { categoriesAndTags } = categoriesAndTagsData.data;

  const tagsDataForNewPostForm = await axios.get(
    `${conf.baseFetchUrl}/api/tags`,
  );
  const { tagList } = tagsDataForNewPostForm.data;

  return (
    <div className="bg-100devs min-h-screen">
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
          <h1 className="text-center text-2xl bg-100devs rounded-3xl py-4">
            Welcome User!
          </h1>
          <h4> Stats </h4>
          <span className="block">
            Liked: {likedPosts.data.posts.length || "0"}
          </span>
          <span className="block">
            Submitted: {submittedPosts.data.posts.length || "0"}
          </span>
        </div>
      </div>

      <main className="text-center mt-[150px]">
        <DashBoardContentSections
          initialPosts={likedPosts.data}
          submittedPosts={submittedPosts.data}
          categoriesAndTags={categoriesAndTags}
          tagList={tagList}
        />
      </main>
    </div>
  );
}
