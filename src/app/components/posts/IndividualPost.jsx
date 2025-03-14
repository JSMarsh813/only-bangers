import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import ParagraphRenderBasedOnArrayProperty from "../ParagraphRenderBasedOnArrayProperty";
import ShowTime from "../ShowTime";
import LikesButtonAndLogic from "../LikesButtonAndLikesLogic";
import { useUser } from "../../components/context-wrappers/UserInfo";
import checkIfUrlWillLoad from "../../../utils/checkIfUrlWillLoad";
import DeleteButton from "../deleting-data/DeleteButton";
import EditButton from "../editing-data/EditButton";
import FlaggingContentSection from "../flagging/FlaggingContentSection";
import ToggeableAlert from "../ToggeableAlert";

export default function IndividualPost({ post, tagList }) {
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [urlAllowedInIframe, setUrlAllowedInIframe] = useState(true);
  const [messageFromApi, setMessageFromApi] = useState([]);
  const [showApiMessage, setShowApiMessage] = useState(false);
  let userInfo = useUser();
  let { currentUsersInfo, other } = userInfo;
  let currentUsersId = currentUsersInfo.$id;
  let userIsTheCreator = post.shared_by_user.$id === currentUsersInfo.$id;

  //put it in a useEffect because of: cannot update a component (`Router`) while rendering a different component (`IndividualPost`). To locate the bad setState() call inside `IndividualPost`
  useEffect(() => {
    if (showApiMessage === false) {
      setMessageFromApi("");
    }
  }, [showApiMessage]);

  useEffect(() => {
    if (messageFromApi != "") {
      setShowApiMessage(true);
    }
  }, [messageFromApi]);

  useEffect(() => {
    async function checkUrl(post) {
      let CanUrlBeEmbedded = await checkIfUrlWillLoad(post);

      setUrlAllowedInIframe(CanUrlBeEmbedded);
    }
    checkUrl(post.resource_url);
  }, []);

  return (
    <section
      key={post.$id}
      id={post.$id}
      className="border-b-4 border-x-4 border-blue-300 bg-100devs"
    >
      {post.content_type === "video-or-podcast" && urlAllowedInIframe && (
        <div className="w-full pt-10">
          <iframe
            id="postVideo"
            src={post.resource_url}
            loading="eager"
            className="mx-auto aspect-video w-5/6 md:w-3/6"
          ></iframe>
        </div>
      )}

      <div className="bg-100devs text-white pt-4">
        {post.content_type === "video-or-podcast" && (
          <div>
            <span className="block">
              {`Start: ${post.start_time_hours} hours ${post.start_time_minutes} minutes ${post.start_time_seconds} seconds`}{" "}
            </span>
          </div>
        )}
        {post.summary && <p> Summary: {post.summary} </p>}

        {post.quote && <blockquote> Quote: {post.quote} </blockquote>}
        <span className="whitespace-pre-wrap break-all">
          Link: {post.resource_url}
        </span>

        <ParagraphRenderBasedOnArrayProperty
          content={post.tags}
          text="tags"
        />

        <div className="flex justify-center gap-8 flex-wrap ">
          <LikesButtonAndLogic
            data={post}
            HeartIconStyling="mr-1"
            apiLink="/api/posts/updateLikes"
          />
          <FlaggingContentSection
            userIsTheCreator={userIsTheCreator}
            signedInUsersId={currentUsersInfo.$id}
            currentTargetedId={post.$id}
            content={post}
            apiflagReportSubmission="/api/flag/flag-report-submission"
            apiaddUserToFlaggedByArray="/api/flag/add-user-to-general-content-flagged-by-array"
            setMessageFromApi={setMessageFromApi}
          />
        </div>

        {currentUsersId === post.shared_by_user.$id && (
          <div className="flex justify-center gap-20">
            <DeleteButton
              signedInUsersId={currentUsersId}
              contentId={post.$id}
              contentCreatedBy={post.shared_by_user.$id}
              setMessageFromApi={setMessageFromApi}
            />
            <EditButton
              post={post}
              tagList={tagList}
              setMessageFromApi={setMessageFromApi}
            />
          </div>
        )}

        {showApiMessage && (
          <ToggeableAlert
            text={messageFromApi[0]}
            successfulOrNot={messageFromApi[1] === "success"}
            setToggleState={setShowApiMessage}
            toggleState={showApiMessage}
          />
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
