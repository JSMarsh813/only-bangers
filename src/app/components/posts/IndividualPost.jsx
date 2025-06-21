import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import ParagraphRenderBasedOnArrayProperty from "../ParagraphRenderBasedOnArrayProperty";
import ShowTime from "../ShowTime";
import LikesButtonAndLogic from "../LikesButtonAndLikesLogic";
import { useUser } from "../../components/context-wrappers/UserInfo";
import DeleteButton from "../deleting-data/DeleteButton";
import EditButton from "../editing-data/EditButton";
import FlaggingContentSection from "../flagging/FlaggingContentSection";
import ToggeableAlert from "../ToggeableAlert";
import ImportantSpans from "../ImportantSpans";

export default function IndividualPost({
  post,
  tagList,
  setNameEditedFunction,
  setDeleteThisContentId,
  setChangedItemsSwrPageFunction,
  changedItemsSwrPage,
  categoriesAndTags,
}) {
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [urlAllowedInIframe, setUrlAllowedInIframe] = useState(
    post.isUrlEmbedded,
  );
  const [messageFromApi, setMessageFromApi] = useState([]);
  const [showApiMessage, setShowApiMessage] = useState(false);
  const [copied, setCopied] = useState(false);

  let userInfo = useUser();
  let { currentUsersInfo, other } = userInfo;
  let currentUsersId = currentUsersInfo.$id;
  let userIsTheCreator = post.shared_by_user.$id === currentUsersInfo.$id;
  let postsSwrPageProperty = post.swrPage;

  const handleCopy = () => {
    navigator.clipboard.writeText(post.resource_url).then(() => {
      setCopied(true);
      //will turn off the copied alert after 5 seconds
      setTimeout(() => setCopied(false), 5000);
    });
  };

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

  //necessary because we're conditionally rendering the component, otherwise react won't realize it needs to recheck that conditional rendering
  useEffect(() => {
    if (urlAllowedInIframe !== post.isUrlEmbedded)
      setUrlAllowedInIframe(post.isUrlEmbedded);
  }, [post]);

  return (
    <section
      key={post.$id}
      id={post.$id}
      className="border-b-4 border-x-4 border-blue-300 bg-blue-800"
    >
      {post.has_a_play_button === "yes" && urlAllowedInIframe && (
        <div className="w-full pt-10">
          <iframe
            id="postVideo"
            src={post.resource_url}
            loading="eager"
            className="mx-auto aspect-video w-5/6 md:w-3/6"
          ></iframe>
        </div>
      )}

      <div className="bg-blue-800 text-white pt-4 ">
        {/* ###########   Shared Content Section  ########### */}
        <section className="mx-auto max-w-[950px] text-left">
          {post.has_a_play_button === "yes" && (
            <div className="pb-4">
              <span className="block">
                <ImportantSpans text="TimeStamp" />
                {`${post.start_time_hours} hours ${post.start_time_minutes} minutes ${post.start_time_seconds} seconds`}{" "}
              </span>
            </div>
          )}
          {post.summary.trim().length != 0 && (
            <div className="flex pb-4">
              <ImportantSpans text="Summary" />
              <p className="inline-block whitespace-pre-wrap">
                {post.summary}{" "}
              </p>
            </div>
          )}

          {/* the empty field for post.quote was stored as "\r\n", so we have to trim the whitespace out to check the length, before conditionally rendering 
          
          !=0 necessary for it to not render a 0 instead */}
          {post.quote.trim().length != 0 && (
            <div className=" flex">
              <ImportantSpans text="Quote" />
              <blockquote className="pb-4 inline-block whitespace-pre-wrap">
                {post.quote}{" "}
              </blockquote>
            </div>
          )}
          <div className="whitespace-pre-wrap break-all pb-4">
            <ImportantSpans text="Link" />
            {post.resource_url}
            <button
              onClick={handleCopy}
              title="Copy to clipboard"
              className="ml-2 bg-blue-400 border-2 border-blue-100 shadow-md shadow-black p-2 rounded-full"
            >
              📋
            </button>

            {copied && (
              <strong
                className="bg-green-900 border-2 border-green-200 text-white text-center block mx-auto w-40 "
                role="alert"
                aria-live="assertive"
              >
                Link copied to clipboard!
              </strong>
            )}
          </div>

          <ParagraphRenderBasedOnArrayProperty
            content={post.tags}
            text="tags"
          />

          <div className="flex justify-center gap-8 flex-wrap border-y-2 border-blue-300 my-4 pt-4">
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
                setDeleteThisContentId={setDeleteThisContentId}
                postsSwrPageProperty={postsSwrPageProperty}
                setChangedItemsSwrPageFunction={setChangedItemsSwrPageFunction}
              />
              <EditButton
                post={post}
                tagList={tagList}
                setMessageFromApi={setMessageFromApi}
                setNameEditedFunction={setNameEditedFunction}
                postsSwrPageProperty={postsSwrPageProperty}
                setChangedItemsSwrPageFunction={setChangedItemsSwrPageFunction}
                changedItemsSwrPage={changedItemsSwrPage}
                categoriesAndTags={categoriesAndTags}
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
        </section>

        {/* ################ SHARED BY USER SECTION ########## */}
        {post.shared_by_user && (
          <section className="flex justify-center bg-blue-950 mx-auto  text-white py-4">
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
