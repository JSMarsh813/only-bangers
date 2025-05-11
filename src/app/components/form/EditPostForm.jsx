"use client";
import { useState, useEffect, useActionState } from "react";
import { updatePost } from "../../../server-actions/postActions";
import Select, { StylesConfig } from "react-select";
import GeneralButton from "../GeneralButton";
import { useUser } from "../context-wrappers/UserInfo";
import { Dialog, DialogPanel } from "@headlessui/react";
import WarningNotice from "../WarningNotice";
import LoadingSpinner from "../LoadingSpinner";

export default function NewPostForm({
  post,
  tagList,
  editFormVisible,
  setEditFormVisible,
  setMessageFromApi,
  setNameEditedFunction,
  postsSwrPageProperty,
  setChangedItemsSwrPageFunction,
  changedItemsSwrPage,
}) {
  const [tags, setTags] = useState(tagList);
  const [processingEditRequest, setProcessingEditRequest] = useState(false);
  let originalTags = post.tags.map((item) => item.$id);

  const [selectedContentType, setselectedContentType] = useState(
    post.content_type,
  );
  const [stateResourceUrl, setStateResourceUrl] = useState(post.resource_url);
  const [summary, setSummary] = useState(post.summary);
  const [quote, setQuote] = useState(post.quote);
  const [tagsToSubmit, setToSubmitTags] = useState(originalTags);
  const [startTimeSeconds, setStartTimeSeconds] = useState(
    parseInt(post.startTimeSeconds) || 0,
  );
  const [startTimeMinutes, setStartTimeMinutes] = useState(
    parseInt(post.startTimeMinutes) || 0,
  );
  const [startTimeHours, setStartTimeHours] = useState(
    parseInt(post.startTimeHours) || 0,
  );
  const [shared_by_user, setShared_by_user] = useState("guest");
  const [updateSuccessful, setUpdateSuccessful] = useState("");

  const contentTypesList = [
    "blog-or-article",
    "video-or-podcast",
    "social-media-post",
    "website",
    "book",
  ];

  let userInfo = useUser();
  let parsedUserInfo = JSON.stringify(userInfo);
  let { currentUsersInfo, other } = userInfo;
  let { user_name, profile_image, $id } = currentUsersInfo;

  let userId = user_name != "guest" ? $id : null;

  useEffect(() => {
    if (userId) {
      setShared_by_user(userId);
    }
  }, [userId]);

  const handleSubmitUpdate = async (e) => {
    setProcessingEditRequest(true);
    e.preventDefault();
    //prevents the page refreshing

    if (shared_by_user === "guest" || shared_by_user === undefined) {
      setMessageFromApi(["you must be signed in to edit content", "error"]);
      console.log("you must be signed in to edit content");
      return;
    }

    let addChangesToPostSubmission = async function () {
      // we only want to update the changed fields, so we'll check for what was changed
      const postUpdateSubmission = {};
      // we need to know the content type, for the video embed check
      postUpdateSubmission.content_type = selectedContentType;

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
        postUpdateSubmission.tags = tagsToSubmit;
      }
      return postUpdateSubmission;
    };

    try {
      let postUpdateSubmission = await addChangesToPostSubmission();
      let postUpdated = await updatePost(post.$id, postUpdateSubmission);
      setUpdateSuccessful(true);
      setMessageFromApi(["content was successfully edited!", "success"]);
      setChangedItemsSwrPageFunction(postsSwrPageProperty);
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
                Made a whoops? Click cancel to "ESC" 😉 →{" "}
              </p>

              <GeneralButton
                text="Cancel"
                className="bg-yellow-300 text-blue-950 border-yellow-700"
                onClick={() => setEditFormVisible(false)}
                type="button"
              />
            </div>
            <div className="banner bg-100devs ">
              <h2 className="text-2xl"> Edit</h2>
            </div>

            {/* ########### CONTENT TYPE ############ */}
            <fieldset disabled={shared_by_user === "guest"}>
              <legend className="bg-100devs banner">
                What type of Content is this:
              </legend>
              <WarningNotice text="Required" />

              {contentTypesList.map((contentTypeItem, index) => (
                <label
                  htmlFor={contentTypeItem}
                  key={`${contentTypeItem}${index}`}
                  className="block"
                >
                  <input
                    type="radio"
                    id={contentTypeItem}
                    name="content_type"
                    value={contentTypeItem}
                    required
                    defaultChecked={contentTypeItem === post.content_type}
                    onChange={(e) => {
                      setselectedContentType(e.target.value);
                    }}
                    className="mr-2"
                  />
                  {contentTypeItem}
                </label>
              ))}
            </fieldset>
            {/* ########## url link ############ */}
            <fieldset disabled={shared_by_user === "guest"}>
              <legend className="bg-100devs banner">Url Link </legend>

              <label
                className="font-bold mt-4 "
                htmlFor="url"
              >
                <WarningNotice text="Required" />
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
              <span className="bg-100devs banner"> Summary </span>
              <WarningNotice text="Required" />
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
              <span className="block bg-100devs banner"> Quote </span>
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
            {/* ################## TIME START ################## */}
            {selectedContentType === "video-or-podcast" && (
              <fieldset className="flex justify-center">
                <legend className="bg-100devs banner">
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
                    onChange={(e) => setStartTimeHours(e.target.value)}
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
                    onChange={(e) => setStartTimeMinutes(e.target.value)}
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
                    onChange={(e) => setStartTimeSeconds(e.target.value)}
                  />
                </label>
              </fieldset>
            )}

            {/* ################## TAGS ################## */}

            <label
              className="font-bold block mt-4 "
              htmlFor="tagsForPost"
            >
              <span className="bg-100devs banner"> Tags </span>
              <WarningNotice text="Required" />
            </label>

            <Select
              className={`text-black mb-4`}
              id="tagsForPost"
              isDisabled={shared_by_user === "guest"}
              options={tags.map((option) => ({
                label: option.tag_name,
                value: option.$id,
                key: option.$id,
              }))}
              //{"label":"negotiating-job-offer",
              // "value":"67b23e77002cac41bef9",
              // "key":"67b23e77002cac41bef9"}
              value={tags
                .filter((option) => tagsToSubmit.includes(option.$id))
                .map((option) => ({
                  label: option.tag_name,
                  value: option.$id,
                  key: option.$id,
                }))}
              isMulti
              required
              isSearchable
              onChange={(option) => {
                console.log(
                  `this is onChange option ${JSON.stringify(
                    option.map((optionObject) => optionObject.value),
                  )}`,
                );
                setToSubmitTags(
                  option.map((optionObject) => optionObject.value),
                );
              }}
              placeholder="If you type in the tags field, it will filter the tags"

              //Options object has 3 properties, label, value and key
              //we grab value because that has the tags unique id
            />

            <input
              type="hidden"
              name="shared_by_user"
              value={shared_by_user}
            />
            {!processingEditRequest && (
              <div className="flex justify-center gap-20">
                <GeneralButton
                  text="Cancel"
                  className="warning"
                  onClick={() => setEditFormVisible(false)}
                  type="button"
                />

                <GeneralButton
                  text={
                    shared_by_user === "guest" ? "Submit (disabled)" : "Submit"
                  }
                  className="bg-yellow-300 text-blue-950 border-yellow-700  flex"
                  type="submit"
                  disabled={shared_by_user === "guest"}
                />
              </div>
            )}

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
