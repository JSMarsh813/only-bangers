"use client";
import { useState, useEffect, useActionState } from "react";
import { addPost } from "../../../server-actions/postActions";
import Select from "react-select";
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

  const [shared_by_user, setShared_by_user] = useState("guest");

  const [tagsToSubmit, setToSubmitTags] = useState([]);
  // const [postSuccessful, setPostSuccessful] = useState("");
  const contentTypesList = [
    "blog-or-article",
    "video-or-podcast",
    "social-media-post",
    "website",
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

  // const postSubmission = {
  //   check_sharing_okay: check_sharing_okay,
  //   link: link,
  //   start_time_hours: start_time_hours,
  //   start_time_minutes: start_time_minutes,
  //   start_time_seconds: start_time_seconds,

  //   end_time_hours: end_time_hours,
  //   end_time_seconds: end_time_seconds,
  //   end_time_minutes: end_time_minutes,

  //   summary: summary,
  //   quote: quote,
  //   shared_by_user: shared_by_user,
  //   category_type: category_type,
  //   tags: tagsToSubmit,
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   //prevents the page refreshing
  //   if (shared_by_user === "guest" || shared_by_user === undefined) {
  //     return;
  //   }
  //   try {
  //     let postSent = await addPost(postSubmission);
  //     setPostSuccessful(true);
  //     setNewContentFormShowing(!newContentFormShowing);
  //   } catch (error) {
  //     setPostSuccessful(false);
  //     console.error(error);
  //   }

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
          {" "}
          Thank you for taking your time to submit content, it's appreciated!
        </p>
      </div>
      {/* ########## Checkbox ############ */}
      <div className="my-6">
        <span className="bg-100devs banner">
          Please confirm that this content:
        </span>

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
          <li key="list-disc-5">is fair use / free</li>
          <li key="list-disc-6">
            is not code weenie content (aka content which demands that theres
            only one right way to code)
          </li>
        </ul>
        <span className="bg-red-500 text-white px-2"> Required * </span>
        <input
          type="checkbox"
          id="sharing-check"
          name="check_sharing_okay"
          value={check_sharing_okay}
          className="mx-2"
          onClick={() => setCheck_sharing_okay(!check_sharing_okay)}
          required
        />
        <label htmlFor="sharing-check">
          This content meets the above guidelines
        </label>
      </div>
      {/* ########### CONTENT TYPE ############ */}
      <fieldset>
        <legend className="bg-100devs banner">
          What type of Content is this:
        </legend>
        <span className="bg-red-500 text-white px-2"> Required * </span>

        {contentTypesList.map((contentTypeItem, index) => (
          <label
            htmlFor={contentTypeItem}
            key={`${contentTypeItem}${index}`}
            className="block"
          >
            <input
              type="radio"
              id={contentTypeItem}
              name="content-type"
              value={contentTypeItem}
              required
              className="mr-2"
            />
            {contentTypeItem}
          </label>
        ))}
      </fieldset>
      {/* ########## url link ############ */}
      <label
        className="font-bold mt-4 "
        htmlFor="url"
      >
        <span className="bg-100devs banner">Url Link</span>
        <span className="bg-red-500 text-bwhite px-2"> Required * </span>
        <input
          type="url"
          id="urlInput"
          name="link"
          className="w-4/6 text-black"
          default="https://www.google.com"
          placeholder="ex: https://www"
          pattern="https://.*"

          // disabled={sessionFromServer ? "" : "disabled"}
        />
      </label>
      {/* ################## Review ################## */}
      <label
        className="font-bold block mt-4"
        htmlFor="review"
      >
        <span className="bg-red-500 text-white px-2">
          {" "}
          You must enter a summary, quote or both*{" "}
        </span>

        <span className="bg-100devs banner"> Summary </span>
        <textarea
          id="review"
          className="w-5/6 text-black"
          placeholder="Write a summary here"
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
          className="w-5/6 text-black"
          placeholder="type a quote here"
        />
      </label>
      {/* ################## TIME START ################## */}

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

      {/* ################## TIME END ################## */}

      <fieldset className="flex justify-center">
        <legend className="bg-100devs banner">
          Please Enter a Ending Time:{" "}
        </legend>

        <FormInputs
          label="Hours"
          type="number"
          inputname="end-time-hours"
          inputid="hoursEndingInput"
          placeholder="00"
        />

        <FormInputs
          label="Minutes"
          type="number"
          inputname="end-time-minutes"
          inputid="minutesEndingInput"
          placeholder="00"
        />

        <FormInputs
          label="Seconds"
          type="number"
          inputname="end-time-seconds"
          inputid="secondsEndingInput"
          placeholder="00"
        />
      </fieldset>

      {/* ################## TAGS ################## */}

      <label
        className="font-bold block mt-4 "
        htmlFor="tagsForPost"
      >
        <span className="bg-100devs banner"> Tags </span>
        <span className="bg-red-500 text-white px-2"> Required * </span>
      </label>
      <Select
        className="text-black mb-4"
        id="tagsForPost"
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
          text="Submit New Content"
          className="mx-auto"
          type="submit"
        />
      </div>
    </form>
  );
}
