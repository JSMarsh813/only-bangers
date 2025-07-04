"use client";
import { useState, useEffect, useActionState } from "react";
import { updatePost } from "../../../server-actions/postActions";
import GeneralButton from "../GeneralButton";
import { useUser } from "../context-wrappers/UserInfo";
import { Dialog, DialogPanel } from "@headlessui/react";
import WarningNotice from "../WarningNotice";
import LoadingSpinner from "../LoadingSpinner";
import RequiredSpan from "./RequiredSpan";
import TagFormSection from "./TagFormSection";

type EditPostFormTypes = {
  post: PostType;
  tagList: TagType[];
  editFormVisible: boolean;
  categoriesAndTags: CategoriesWithTagsType[];
  postsSwrPageProperty: number | null | undefined;

  setMessageFromApi: React.Dispatch<React.SetStateAction<string[]>>;

  setEditFormVisible: React.Dispatch<React.SetStateAction<boolean>>;

  setChangedItemsSwrPage: React.Dispatch<
    React.SetStateAction<number | null | undefined>
  >;

  setNameEditedFunction: React.Dispatch<React.SetStateAction<boolean>>;
  // changedItemsSwrPage,
};
export default function EditPostForm({
  post,
  tagList,
  editFormVisible,
  setEditFormVisible,
  setMessageFromApi,
  setNameEditedFunction,
  postsSwrPageProperty,
  setChangedItemsSwrPage,
  // changedItemsSwrPage,
  categoriesAndTags,
}: EditPostFormTypes) {
  const [processingEditRequest, setProcessingEditRequest] = useState(false);

  const [hasAPlayButton, setHasAPlayButton] = useState(post.has_a_play_button);
  const [stateResourceUrl, setStateResourceUrl] = useState(post.resource_url);
  const [summary, setSummary] = useState(post.summary);
  const [quote, setQuote] = useState(post.quote);

  const [postUpdateSubmission, setPostUpdateSubmission] =
    useState<FormStateType | null>(null);

  const originalTags = post.tags.map((item) => ({
    label: item.tag_name,
    value: item.$id,
    key: item.$id,
  }));
  const [tagsToSubmit, setToSubmitTags] = useState(originalTags);
  const [tagsValidated, setTagsValidated] = useState(false);

  const [startTimeSeconds, setStartTimeSeconds] = useState(
    post.start_time_seconds || 0,
  );
  const [startTimeMinutes, setStartTimeMinutes] = useState(
    post.start_time_minutes || 0,
  );
  const [startTimeHours, setStartTimeHours] = useState(
    post.start_time_hours || 0,
  );

  const [shared_by_user, setShared_by_user] = useState("guest");
  const [updateSuccessful, setUpdateSuccessful] = useState<boolean | null>(
    null,
  );

  const userInfo = useUser();

  const { currentUsersInfo, ...other } = userInfo;
  const { user_name, profile_image, $id } = currentUsersInfo;

  const userId = user_name !== "guest" ? $id : null;

  useEffect(() => {
    if (userId) {
      setShared_by_user(userId);
    }
  }, [userId]);

  const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    setProcessingEditRequest(true);
    e.preventDefault();
    //prevents the page refreshing

    if (shared_by_user === "guest" || shared_by_user === undefined) {
      setMessageFromApi(["you must be signed in to edit content", "error"]);
      console.log("you must be signed in to edit content");
      return;
    }

    const addChangesToPostSubmission = async function () {
      const postUpdateSubmission: FormStateType = {
        check_sharing_okay: post.check_sharing_okay,
        resource_url: post.resource_url,
        summary: post.summary,
        shared_by_user: post.shared_by_user.$id,
        has_a_play_button: hasAPlayButton,
        tags: [],
        isUrlEmbedded: post.isUrlEmbedded,
      };

      // we need to kknow if it has a play button, for the video embed check

      if (stateResourceUrl != post.resource_url) {
        postUpdateSubmission.resource_url = stateResourceUrl;
      }
      if (summary != post.summary) {
        postUpdateSubmission.summary = summary;
      }
      if (quote != post.quote) {
        postUpdateSubmission.quote = quote;
      }

      if (tagsToSubmit != originalTags) {
        postUpdateSubmission.tags = tagsToSubmit.map((obj) => obj.value);
      }
      return postUpdateSubmission;
    };

    try {
      const postUpdateSubmission = await addChangesToPostSubmission();
      const postUpdated = await updatePost(post.$id, postUpdateSubmission);
      setUpdateSuccessful(true);
      setMessageFromApi(["content was successfully edited!", "success"]);
      setChangedItemsSwrPage(postsSwrPageProperty);
      setNameEditedFunction(true);

      setEditFormVisible(false);
      setProcessingEditRequest(false);
    } catch (error) {
      setUpdateSuccessful(false);
      setEditFormVisible(false);
      setProcessingEditRequest(false);
      setMessageFromApi(["there was an error when saving your edits", "error"]);
      console.error(error);
    }
  };

  return (
    <Dialog
      open={editFormVisible}
      onClose={() => setEditFormVisible(false)}
      className="relative z-50 "
    >
      <div
        className="fixed inset-0 flex w-screen overflow-scroll justify-center"
        tabIndex={1}
      >
        <DialogPanel className=" bg-black px-8 py-4 bg-opacity-80 h-fit w-screen">
          <form
            onSubmit={handleSubmitUpdate}
            className=" mx-auto bg-blue-900 rounded-lg w-[94vw] text-center text-white"
          >
            <div className="flex justify-center">
              <p className="my-auto pr-6">
                {" "}
                Made a whoops? Click cancel to &quot;ESC&quot; 😉 →{" "}
              </p>

              <GeneralButton
                text="Cancel"
                className="bg-yellow-300 text-blue-950 border-yellow-700"
                onClick={() => setEditFormVisible(false)}
                type="button"
              />
            </div>
            <div className="banner bg-blue-950 ">
              <h2 className="text-2xl"> Edit</h2>
            </div>

            {/* ########## url link ############ */}
            <fieldset disabled={shared_by_user === "guest"}>
              <legend className="bg-blue-950 banner">Url Link </legend>

              <label
                className="font-bold mt-4 "
                htmlFor="url"
              >
                <RequiredSpan />
                <input
                  type="url"
                  id="urlInput"
                  name="resource_url"
                  className="w-4/6 text-black"
                  value={stateResourceUrl}
                  onChange={(e) => setStateResourceUrl(e.target.value)}
                  pattern="https://.*"
                  required

                  // disabled={sessionFromServer ? "" : "disabled"}
                />
              </label>
            </fieldset>
            {/* ################## Review ################## */}
            <label
              className="font-bold block mt-4"
              htmlFor="review"
            >
              <span className="bg-blue-950 banner"> Summary </span>
              <RequiredSpan />
              <textarea
                id="review"
                name="summary"
                className="w-5/6 text-black"
                placeholder="Write a summary here"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                disabled={shared_by_user === "guest"}
              />
            </label>
            {/* ################## Quote ################## */}
            <label
              className="font-bold block mt-4"
              htmlFor="quote"
            >
              <span className="block bg-blue-950 banner"> Quote </span>
              <textarea
                id="quote"
                name="quote"
                className="w-5/6 text-black"
                placeholder="type a quote here"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                disabled={shared_by_user === "guest"}
              />
            </label>

            {/* ########### CONTENT TYPE ############ */}
            <fieldset disabled={shared_by_user === "guest"}>
              <legend className=" bg-blue-950 banner">
                Does this content have a play button? (ex: video, podcast)
              </legend>
              <RequiredSpan />

              <label
                htmlFor="doesContentHaveAPlayButtonYes"
                className="mr-2"
              >
                Yes
              </label>
              <input
                type="radio"
                id="doesContentHaveAPlayButtonYes"
                name="has_a_play_button"
                value="yes"
                required
                onChange={(e) =>
                  setHasAPlayButton(
                    e.target.value as PostType["has_a_play_button"],
                  )
                }
                className="mr-2"
                checked={hasAPlayButton === "yes"}
              />
              {/* typescript error: Argument of type 'string' is not assignable to parameter of type 'SetStateAction<"yes" | "no" | "error" | "No value found">'.

//Why? e.target.value is always typed as string
// 
//TypeScript sees a potential mismatch because any string could come out of e.target.value, not guaranteed to match your union of specific string values
// 
// Solution type assertion of validate it with an if statement
// type assertion: etHasAPlayButton(e.target.value as PostType["has_a_play_button"])}
  */}
              <label
                htmlFor="doesContentHaveAPlayButtonNo"
                className="mr-2"
              >
                No
              </label>

              <input
                type="radio"
                id="doesContentHaveAPlayButtonNo"
                name="has_a_play_button"
                value="no"
                onChange={(e) =>
                  setHasAPlayButton(
                    e.target.value as PostType["has_a_play_button"],
                  )
                }
                className="mr-2"
                checked={hasAPlayButton === "no"}
              />
            </fieldset>

            {/* ################## TIME START ################## */}
            {hasAPlayButton === "yes" && (
              <fieldset className="flex justify-center">
                <legend className="bg-blue-950 banner">
                  Please Enter a Starting Time:{" "}
                </legend>

                <label htmlFor="hoursStartingInput">
                  Hours:
                  <input
                    type="number"
                    className="w-[50] text-center mx-2"
                    name="start_time_hours"
                    id="hoursStartingInput"
                    value={startTimeHours}
                    onChange={(e) =>
                      setStartTimeHours(parseInt(e.target.value))
                    }
                  />
                </label>

                <label htmlFor="minutessStartingInput">
                  minutes
                  <input
                    type="number"
                    className="w-[50] text-center mx-2"
                    name="start_time_minutes"
                    id="hoursStartingInput"
                    value={startTimeMinutes}
                    onChange={(e) =>
                      setStartTimeMinutes(parseInt(e.target.value))
                    }
                  />
                </label>

                <label htmlFor="secondsStartingInput">
                  minutes
                  <input
                    type="number"
                    className="w-[50] text-center mx-2"
                    name="start_time_minutes"
                    id="secondsStartingInput"
                    value={startTimeSeconds}
                    onChange={(e) =>
                      setStartTimeSeconds(parseInt(e.target.value))
                    }
                  />
                </label>
              </fieldset>
            )}

            {/* ################## TAGS ################## */}

            <TagFormSection
              categoriesAndTags={categoriesAndTags}
              tagList={tagList}
              setTagsValidated={setTagsValidated}
              tagsToSubmit={tagsToSubmit}
              setToSubmitTags={setToSubmitTags}
              shared_by_user={shared_by_user}
            />

            {/* ################## USER ID ################## */}

            <input
              type="hidden"
              name="shared_by_user"
              value={shared_by_user}
            />

            {/* ############### IF NOT PROCESSING REQUEST ################## */}

            {!processingEditRequest && (
              <div className="flex justify-evenly">
                <GeneralButton
                  text="Cancel"
                  className="warning ml-4"
                  onClick={() => setEditFormVisible(false)}
                  type="button"
                />

                {!tagsValidated && (
                  <WarningNotice
                    className="w-fit mt-4"
                    text="Select a tag under the content type tag category to enable the submit button"
                  />
                )}
                <GeneralButton
                  text={
                    shared_by_user === "guest" ? "Submit (disabled)" : "Submit"
                  }
                  className="bg-yellow-300 text-blue-950 border-yellow-700"
                  type="submit"
                  disabled={
                    shared_by_user === "guest" || tagsValidated === false
                  }
                />
              </div>
            )}

            {/* ############### IF PROCESSING REQUEST ################## */}

            {processingEditRequest && (
              <div className="flex align-middle justify-center">
                <p className="my-auto text-white">Processing your edits</p>
                <LoadingSpinner />
              </div>
            )}
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
