"use client";
import { useState, useEffect, useActionState } from "react";
import { addPost } from "../../../server-actions/postActions";
import Select, { StylesConfig } from "react-select";
import FormInputs from "./FormInputs";
import GeneralButton from "../GeneralButton";
import NotifsTwoPossibilities from "../NotifsTwoPossibilities";
import { useUser } from "../context-wrappers/UserInfo";
import revalidatePostData from "../../../server-actions/revalidatePostData";

export default function NewPostForm({
  tagList,
  setNewContentFormShowing,
  newContentFormShowing,
}) {
  const [state, action, isPending] = useActionState(
    addPost,
    null,
    // setPostSuccessful(true);
    // setNewContentFormShowing(!newContentFormShowing);
    // } catch (error) {
    //   setPostSuccessful(false);
    //   console.error(error);
    // }
  );

  const [check_sharing_okay, setCheck_sharing_okay] = useState(false);
  const [tags, setTags] = useState(tagList);
  const [selectedContentType, setselectedContentType] = useState("");
  const [shared_by_user, setShared_by_user] = useState("guest");

  const [tagsToSubmit, setToSubmitTags] = useState([]);
  // const [postSuccessful, setPostSuccessful] = useState("");
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

  return (
    <form
      action={action}
      className=" mx-auto bg-blue-900 rounded-lg w-[94vw] text-center text-white"
    >
      <span> {`this is ${isPending}`} </span>
      <span> {`this is ${state}`} </span>
      <div className="flex justify-center">
        <p className="my-auto pr-6">
          {" "}
          Made a whoops? Click cancel to "ESC" 😉 →{" "}
        </p>

        <GeneralButton
          text="Cancel"
          className="delete-button"
          onClick={() => setNewContentFormShowing(!newContentFormShowing)}
          type="button"
        />
      </div>
      <div className="banner bg-100devs ">
        <h2 className="text-2xl"> Submitting Content</h2>
        <p>
          Thank you for taking your time to submit content, it's appreciated!
        </p>
        {shared_by_user === "guest" && (
          <p className="bg-red-500 w-fit mx-auto px-10 py-2">
            You must sign in to enable this form 😉
          </p>
        )}
      </div>

      {/* ########## Checkbox ############ */}
      <fieldset className="my-6">
        <legend className="bg-100devs banner">
          Please confirm that this content:
        </legend>

        <ul className="list-disc">
          <li key="list-disc-1">
            is accessible through a publically available url link{" "}
          </li>
          <li key="list-disc-2">
            {" "}
            not related to or is a private conversation{" "}
          </li>
          <li key="list-disc-3">
            not related to a private or limited event (ex: office hours or tea
            spills)
          </li>
          <li key="list-disc-4">
            does not have a reasonable expectation for privacy
          </li>
          <li key="list-disc-5">
            is not code weenie content (aka content which demands that theres
            only one right way to code)
          </li>
        </ul>
        <span className="bg-red-500 text-white block w-32 mb-2 mx-auto px-2">
          {" "}
          Required *{" "}
        </span>
        <input
          type="checkbox"
          id="sharing-check"
          name="check_sharing_okay"
          value={check_sharing_okay}
          className="mx-2"
          onClick={() => setCheck_sharing_okay(!check_sharing_okay)}
          required
          disabled={shared_by_user === "guest"}
        />
        <label htmlFor="sharing-check">
          This content meets the above guidelines
        </label>
      </fieldset>
      {/* ########### CONTENT TYPE ############ */}
      <fieldset disabled={shared_by_user === "guest"}>
        <legend className="bg-100devs banner">
          What type of Content is this:
        </legend>
        <span className="bg-red-500 text-white block w-32 mb-2 mx-auto px-2">
          {" "}
          Required *{" "}
        </span>

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
          <span className="bg-red-500 text-white block w-32 mb-2 mx-auto px-2">
            {" "}
            Required *{" "}
          </span>{" "}
          <input
            type="url"
            id="urlInput"
            name="resource_url"
            className="w-4/6 text-black"
            default="https://www.google.com"
            placeholder="ex: https://www"
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
        <span className="bg-red-500 text-white block w-32 mb-2 mx-auto px-2">
          Required *
        </span>
        <textarea
          id="review"
          name="summary"
          className="w-5/6 text-black"
          placeholder="Write a summary here"
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
          disabled={shared_by_user === "guest"}
        />
      </label>
      {/* ################## TIME START ################## */}
      {selectedContentType === "video-or-podcast" && (
        <fieldset className="flex justify-center">
          <legend className="bg-100devs banner">
            Please Enter a Starting Time:{" "}
          </legend>

          <FormInputs
            label="Hours"
            type="number"
            inputname="start_time_hours"
            inputid="hoursStartingInput"
            placeholder="00"
          />

          <FormInputs
            label="Minutes"
            type="number"
            inputname="start-time-minutes"
            inputid="minutesStartingInput"
            placeholder="00"
          />

          <FormInputs
            label="Seconds"
            type="number"
            inputname="start-time-seconds"
            inputid="secondsStartingInput"
            placeholder="00"
          />
        </fieldset>
      )}

      {/* ################## TAGS ################## */}

      <label
        className="font-bold block mt-4 "
        htmlFor="tagsForPost"
      >
        <span className="bg-100devs banner"> Tags </span>
        <span className="bg-red-500 text-white block w-32 mb-2 mx-auto px-2">
          {" "}
          Required *{" "}
        </span>
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
        isMulti
        required
        isSearchable
        onChange={(option) => {
          setToSubmitTags(option.map((obj) => obj.value));
        }}
        placeholder="If you type in the tags field, it will filter the tags"

        //Options object has 3 properties, label, value and key
        //we grab value because that has the tags unique id
      />
      {/* 
the select input is still very buggy for useActionState, I used state and pushed that state into a hidden input as a workaround
      https://github.com/facebook/react/issues/32362
      https://github.com/facebook/react/issues/30580 
      */}

      <input
        type="hidden"
        name="tags"
        value={tagsToSubmit}
      />

      {/* <NotifsTwoPossibilities
        determiningFactor={postSuccessful}
        firstText="Post successfully Sent!"
        secondText="There was an error with submitting your post"
      /> */}
      <input
        type="hidden"
        name="shared_by_user"
        value={shared_by_user}
      />
      <div className="flex justify-center gap-10">
        <GeneralButton
          text="Cancel"
          className=" delete-button"
          onClick={() => setNewContentFormShowing(!newContentFormShowing)}
          type="button"
        />

        <GeneralButton
          text={shared_by_user === "guest" ? "Submit (disabled)" : "Submit"}
          className="mx-auto bg-100devs"
          type="submit"
          disabled={shared_by_user === "guest"}
        />
      </div>
    </form>
  );
}
