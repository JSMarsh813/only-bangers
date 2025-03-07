"use client";

import React, { useState } from "react";
import PostList from "../posts/PostList";
import GeneralButton from "../GeneralButton";

export default function DashboardContentSections({
  initialPosts,
  submittedPosts,
  categoriesAndTags,
  tagList,
}) {
  const [showLikedPosts, setShowLikedPosts] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);

  return (
    <div className="bg-100devs">
      <section>
        <GeneralButton
          text={`${showLikedPosts ? "Hide Likes" : "Show Likes"}`}
          className="mx-auto"
          onClick={() => setShowLikedPosts(!showLikedPosts)}
          type="button"
        />
        {showLikedPosts && (
          <PostList
            initialPosts={initialPosts.posts}
            categoriesAndTags={categoriesAndTags}
            tagList={tagList}
          />
        )}
      </section>
      <section>
        <GeneralButton
          text={`${showSubmissions ? "Hide Submissions" : "Show Submissions"}`}
          className="mx-auto"
          onClick={() => setShowSubmissions(!showSubmissions)}
          type="button"
        />
        {showSubmissions && (
          <PostList
            initialPosts={submittedPosts.posts}
            categoriesAndTags={categoriesAndTags}
            tagList={tagList}
          />
        )}
      </section>
    </div>
  );
}
