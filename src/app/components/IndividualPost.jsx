import React from "react";
import { useState } from "react";
import Image from "next/image";
import { deletePost } from "../actions/postActions";
import ParagraphRenderBasedOnArrayProperty from "./ParagraphRenderBasedOnArrayProperty";
import GeneralButton from "./GeneralButton";
import ShowTime from "./ShowTime";
import NotifsTwoPossibilities from "./NotifsTwoPossibilities";

export default function IndividualPost({ post }) {
  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPostDeleted(true);
    } catch (error) {
      console.error();
      setPostDeleted(false);
    }
  };

  const [postDeleted, setPostDeleted] = useState("");
  return (
    <section
      key={post.$id}
      id={post.$id}
      className="border-2 border-blue-900"
    >
      {/* <span>
        {" "}
        {`this is post ${JSON.stringify(post.tags.map((tag) => tag.tag_name))}`}
      </span> */}
      {post.category_type === "video-or-podcast" && (
        <div className="w-full">
          <iframe
            src={post.link}
            loading="eager"
            className="mx-auto aspect-video w-5/6 md:w-4/6"
          ></iframe>
        </div>
      )}
      <div className="bg-100devs text-white">
        {post.category_type === "video-or-podcast" && (
          <div>
            <span className="block">
              {`Start: ${post.start_time_hours} hours ${post.start_time_minutes} minutes ${post.start_time_seconds} seconds`}{" "}
            </span>
            <span className="block">
              {`End: ${post.end_time_hours} hours ${post.end_time_minutes} minutes ${post.end_time_seconds} seconds`}{" "}
            </span>
          </div>
        )}
        {post.summary && <p> Summary: {post.summary} </p>}

        {post.quote && <blockquote> Quote: {post.quote} </blockquote>}
        <span className="whitespace-pre-wrap break-all">
          {" "}
          Link: {post.link}
        </span>

        {/* <p>Shared by: {post.shared_by_user}</p> */}
        {post.shared_by_user && (
          <section className="flex justify-center bg-blue-900 mx-auto w-[90vw] text-white py-4">
            <Image
              src={post.shared_by_user.profile_image}
              layout=""
              alt=""
              className="rounded-2xl inline mr-2"
              width={80}
              height={80}
            />
            <div>
              <span className="font-bold block">
                Shared by: {post.shared_by_user.user_name}{" "}
              </span>
              <ShowTime postDate={post.$createdAt} />
            </div>
          </section>
        )}
        <ParagraphRenderBasedOnArrayProperty
          content={post.tags}
          text="tags"
        />

        <NotifsTwoPossibilities
          determiningFactor={postDeleted}
          firstText="Post deleted!"
          secondText="There was an error with deleting this post"
        />

        <GeneralButton
          text="Delete"
          className="mx-auto delete-button"
          type="submit"
          onClick={() => handleDelete(post.$id)}
        />
      </div>
    </section>
  );
}
