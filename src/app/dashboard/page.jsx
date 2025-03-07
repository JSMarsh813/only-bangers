"use server";
import { cookies } from "next/headers";
import { getUser } from "@/partials/auth";
import axios from "axios";
import conf from "@/config/envConfig";
import DashBoardContentSections from "../components/dashboard/DashboardContentSections";

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
      <span> Dashboard </span>

      <main className="text-center">
        <DashBoardContentSections
          initialPosts={likedPosts.data}
          categoriesAndTags={categoriesAndTags}
          tagList={tagList}
        />
      </main>
      <footer className="">
        <span> Footer</span>
      </footer>
    </div>
  );
}
