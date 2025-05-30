"use client";

import React, { useState } from "react";
import PostList from "../posts/PostList";
import GeneralButton from "../GeneralButton";
import WideDivider from "../WideDivider";

export default function DashboardContentSections({
  likedGeneralPostsCount,
  submittedGeneralPostsCount,
  categoriesAndTags,
  tagList,
  usersId,
}) {
  const [showLikedPosts, setShowLikedPosts] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const currentUsersId = usersId ? usersId : "null";

  return (
    <div className="bg-blue-950">
      <WideDivider heading="General Resources" />
      <section>
        <GeneralButton
          text={`${showLikedPosts ? "Hide Likes" : "Show Likes"}`}
          className="mx-auto bg-yellow-200 border-yellow-600 text-blue-950"
          onClick={() => setShowLikedPosts(!showLikedPosts)}
          type="button"
        />
        {showLikedPosts && (
          <PostList
            // initialPosts={initialPosts.posts}
            swrApiPath="posts/get-users-liked-posts"
            categoriesAndTags={categoriesAndTags}
            tagList={tagList}
            countOfPosts={likedGeneralPostsCount}
            currentUsersId={currentUsersId}
          />
        )}
      </section>
      <section>
        <GeneralButton
          text={`${showSubmissions ? "Hide Submissions" : "Show Submissions"}`}
          className="mx-auto  bg-yellow-200 border-yellow-600  text-blue-950"
          onClick={() => setShowSubmissions(!showSubmissions)}
          type="button"
        />
        {showSubmissions && (
          <PostList
            categoriesAndTags={categoriesAndTags}
            swrApiPath="posts/get-users-submitted-posts"
            tagList={tagList}
            countOfPosts={submittedGeneralPostsCount}
            currentUsersId={currentUsersId}
          />
        )}
      </section>
    </div>
  );
}
