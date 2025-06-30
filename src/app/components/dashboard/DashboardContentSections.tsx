"use client";

import React, { useState } from "react";
import PostList from "../posts/PostList";
import GeneralButton from "../GeneralButton";
import WideDivider from "../WideDivider";
import WarningNotice from "../WarningNotice";

type DashBoardContentSectionsTypes = {
  likedGeneralPostsCount: number | { error: boolean; message: string };
  submittedGeneralPostsCount: number | { error: boolean; message: string };
  categoriesAndTags: CategoriesWithTagsType[];
  tagList: TagType[];
};
export default function DashboardContentSections({
  likedGeneralPostsCount,
  submittedGeneralPostsCount,
  categoriesAndTags,
  tagList,
}: DashBoardContentSectionsTypes) {
  const [showLikedPosts, setShowLikedPosts] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);

  return (
    <div className="bg-blue-950">
      <WideDivider heading="General Resources" />
      <section>
        {/* ############# LIKED POSTS  ############# */}
        <GeneralButton
          text={`${showLikedPosts ? "Hide Likes" : "Show Likes"}`}
          className="mx-auto bg-yellow-200 border-yellow-600 text-blue-950"
          onClick={() => setShowLikedPosts(!showLikedPosts)}
          type="button"
        />
        {showLikedPosts && typeof likedGeneralPostsCount === "number" && (
          <PostList
            // initialPosts={initialPosts.posts}
            swrApiPath="posts/get-users-liked-posts"
            categoriesAndTags={categoriesAndTags}
            tagList={tagList}
            countOfPosts={likedGeneralPostsCount}
          />
        )}
        {showLikedPosts && typeof likedGeneralPostsCount !== "number" && (
          <WarningNotice text="an error occured when fetching the current count of liked posts, so these posts cannot currently be shown" />
        )}
      </section>
      {/* ############# SUBMITTED POSTS  ############# */}
      <section>
        <GeneralButton
          text={`${showSubmissions ? "Hide Submissions" : "Show Submissions"}`}
          className="mx-auto  bg-yellow-200 border-yellow-600  text-blue-950"
          onClick={() => setShowSubmissions(!showSubmissions)}
          type="button"
        />
        {showSubmissions && typeof submittedGeneralPostsCount === "number" && (
          <PostList
            categoriesAndTags={categoriesAndTags}
            swrApiPath="posts/get-users-submitted-posts"
            tagList={tagList}
            countOfPosts={submittedGeneralPostsCount}
          />
        )}
        {showSubmissions && typeof submittedGeneralPostsCount !== "number" && (
          <WarningNotice text="an error occured when fetching the current count of submitted posts, so the posts cannot currently be shown" />
        )}
      </section>
    </div>
  );
}
