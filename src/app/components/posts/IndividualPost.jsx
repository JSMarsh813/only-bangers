import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { deletePost } from "../../../server-actions/postActions";
import ParagraphRenderBasedOnArrayProperty from "../ParagraphRenderBasedOnArrayProperty";
import GeneralButton from "../GeneralButton";
import ShowTime from "../ShowTime";
import NotifsTwoPossibilities from "../NotifsTwoPossibilities";
import LikesButtonAndLogic from "../LikesButtonAndLikesLogic";
import { useUser } from "../../components/context-wrappers/UserInfo";
import checkIfUrlWillLoad from "../../../utils/checkIfUrlWillLoad";

export default function IndividualPost({ post }) {
  const [postDeleted, setPostDeleted] = useState("");
  const [urlAllowedInIframe, setUrlAllowedInIframe] = useState(true);
  let userInfo = useUser();
  let { currentUsersInfo, other } = userInfo;
  let currentUsersId = currentUsersInfo.$id;

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPostDeleted(true);
    } catch (error) {
      console.error();
      setPostDeleted(false);
    }
  };

  //put it in a useEffect because of: cannot update a component (`Router`) while rendering a different component (`IndividualPost`). To locate the bad setState() call inside `IndividualPost`
  useEffect(() => {
    async function checkUrl(post) {
      let CanUrlBeEmbedded = await checkIfUrlWillLoad(post);

      setUrlAllowedInIframe(CanUrlBeEmbedded);
    }
    checkUrl(post.link);
  }, []);

  return (
    <section
      key={post.$id}
      id={post.$id}
      className="border-b-4 border-blue-300 bg-100devs"
    >
      {post.category_type === "video-or-podcast" && urlAllowedInIframe && (
        <div className="w-full pt-10">
          <iframe
            id="postVideo"
            src={post.link}
            loading="eager"
            className="mx-auto aspect-video w-5/6 md:w-3/6"
          ></iframe>
        </div>
      )}

      <div className="bg-100devs text-white pt-4">
        {post.category_type === "video-or-podcast" && (
          <div>
            <span className="block">
              {`Start: ${post.start_time_hours} hours ${post.start_time_minutes} minutes ${post.start_time_seconds} seconds`}{" "}
            </span>
          </div>
        )}
        {post.summary && <p> Summary: {post.summary} </p>}

        {post.quote && <blockquote> Quote: {post.quote} </blockquote>}
        <span className="whitespace-pre-wrap break-all">
          {" "}
          Link: {post.link}
        </span>

        <ParagraphRenderBasedOnArrayProperty
          content={post.tags}
          text="tags"
        />

        <NotifsTwoPossibilities
          determiningFactor={postDeleted}
          firstText="Post deleted!"
          secondText="There was an error with deleting this post"
        />

        <div>
          <LikesButtonAndLogic
            data={post}
            apiLink="/api/posts/updateLikes"
          />
        </div>

        {currentUsersId === post.shared_by_user.$id && (
          <div className="flex justify-center gap-20">
            <GeneralButton
              text="Delete"
              className="mx-auto delete-button"
              type="submit"
              onClick={() => handleDelete(post.$id)}
            />

            <GeneralButton
              text="Edit"
              className="mx-auto"
              type="submit"
              onClick={() => handleEdit(post.$id)}
            />
          </div>
        )}

        {post.shared_by_user && (
          <section className="flex justify-center bg-blue-900 mx-auto  text-white py-4">
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
      </div>
    </section>
  );
}
