"use client";
import { useState } from "react";
import { deletePost } from "../actions/postActions";

//<Post[]>'s type is written out in src/types.d.ts
export default function PostList({ initialPosts }: any) {
  //initialPosts is a list of post objects
  const [posts, setPosts] = useState(initialPosts);

  //setPosts grabs the initialPosts prop and says hey, this is list of posts is my starting state

  const handleDelete = async (postId: string) => {
    const element = document.getElementById(postId);

    if (element) {
      element.classList.add("crossed-out");
    }

    await deletePost(postId);
  };
  return (
    <ul>
      {posts.map((post: any) => (
        <li
          key={post.$id}
          id={post.$id}
          onClick={() => handleDelete(post.$id)}
        >
          <p> {post.summary} summary </p>
          <blockquote> {post.quote} quote </blockquote>
          <span> {post.link}</span>
          {post.category_type === "blog-or-article" && (
            <div>
              <span className="block">
                {`Start: ${post.start_time_hours} hours ${post.start_time_minutes} minutes ${post.start_time_seconds} seconds`}{" "}
              </span>
              <span className="block">
                {`End: ${post.end_time_hours} hours ${post.end_time_minutes} minutes ${post.end_time_seconds} seconds`}{" "}
              </span>
            </div>
          )}
          <p>{post.$id}</p>

          <p>Shared by: {post.shared_by_user}</p>
          <p>Tags {post.tags}</p>
        </li>
      ))}
    </ul>
  );
}
