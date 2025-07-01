import React from "react";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
//dispatch needed for state typing for typescript
import Image from "next/image";
import TagListStringFromArray from "../TagListStringFromArray";
import ShowTime from "../ShowTime";
import LikesButtonAndLogic from "../LikesButtonAndLikesLogic";
import { useUser } from "../context-wrappers/UserInfo";
import DeleteButton from "../deleting-data/DeleteButton";
import EditButton from "../editing-data/EditButton";
import FlaggingContentSection from "../flagging/FlaggingContentSection";
import ToggeableAlert from "../ToggeableAlert";
import ImportantSpans from "../ImportantSpans";

type IndividualPost = {
  post: PostType;
  tagList: TagType[];
  categoriesAndTags: CategoriesWithTagsType[];

  setNameEditedFunction: Dispatch<SetStateAction<boolean>>;

  setDeleteThisContentId: Dispatch<SetStateAction<string | null>>;

  setChangedItemsSwrPage: Dispatch<SetStateAction<number | null | undefined>>;
};

export default function IndividualPost({
  post,
  tagList,
  setNameEditedFunction,
  setDeleteThisContentId,
  setChangedItemsSwrPage,
  categoriesAndTags,
}: IndividualPost) {
  const [urlAllowedInIframe, setUrlAllowedInIframe] = useState(
    post.isUrlEmbedded,
  );
  const [messageFromApi, setMessageFromApi] = useState<string[]>([]);
  //setMessageFromApi(["you must be signed in to flag content", "error"]);
  const [showApiMessage, setShowApiMessage] = useState(false);
  const [copied, setCopied] = useState(false);

  const userInfo = useUser();
  const { currentUsersInfo, other } = userInfo;
  const currentUsersId = currentUsersInfo.$id;
  const userIsTheCreator = post.shared_by_user.$id === currentUsersInfo.$id;
  const postsSwrPageProperty = post.swrPage;
  //in postList swrPage is always set to be a number
  // but typescript shows swrPage?: number | undefined
  //ecause in your PostType definition, swrPage is marked as optional

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
      setMessageFromApi([]);
    }
  }, [showApiMessage]);

  useEffect(() => {
    //handles edge cases like [""] or ["",""]
    const messageContainsNonEmptyStrings = messageFromApi.some(
      (message) => message.trim() !== "",
    );

    if (messageFromApi.length > 0 && messageContainsNonEmptyStrings) {
      setShowApiMessage(true);
    }

    //if (messageFromAPI !== [""])does not work because it always returns true because [""] !== [""] since  arrays are reference types and are only equal if they are the same instance, not just structurally identical.
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
          {post.quote?.trim().length != 0 && (
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

          <TagListStringFromArray
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
                setChangedItemsSwrPage={setChangedItemsSwrPage}
              />
              <EditButton
                post={post}
                tagList={tagList}
                setMessageFromApi={setMessageFromApi}
                setNameEditedFunction={setNameEditedFunction}
                postsSwrPageProperty={postsSwrPageProperty}
                setChangedItemsSwrPage={setChangedItemsSwrPage}
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
