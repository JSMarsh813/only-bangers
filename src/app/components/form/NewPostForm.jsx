"use client";
import { useState } from "react";
import { addPost } from "../../../actions/postActions";
import Select from "react-select";
import FormInputs from "./FormInputs";
import GeneralButton from "../GeneralButton";
import NotifsTwoPossibilities from "../NotifsTwoPossibilities";

const NewPostForm = ({
  tagList,
  setNewContentFormShowing,
  newContentFormShowing,
}) => {
  const [tags, setTags] = useState(tagList);

  const [check_sharing_okay, setCheck_sharing_okay] = useState(false);
  const [link, setLink] = useState("");
  const [start_time_hours, setStart_time_hours] = useState(0);
  const [start_time_minutes, setStart_time_minutes] = useState(0);
  const [start_time_seconds, setStart_time_seconds] = useState(0);
  const [end_time_hours, setEnd_time_hours] = useState(0);
  const [end_time_seconds, setEnd_time_seconds] = useState(0);
  const [end_time_minutes, setEnd_time_minutes] = useState(0);
  const [summary, setSummary] = useState("");
  const [quote, setQuote] = useState("");
  const [shared_by_user, setShared_by_user] = useState("67b24d9d000009ade0b1");
  const [category_type, setCategory_type] = useState("");
  const [tagsToSubmit, setToSubmitTags] = useState([]);
  const [postSuccessful, setPostSuccessful] = useState("");
  const contentTypesList = [
    "blog-or-article",
    "video-or-podcast",
    "social-media-post",
  ];

  const postSubmission = {
    check_sharing_okay: check_sharing_okay,
    link: link,
    start_time_hours: start_time_hours,
    start_time_minutes: start_time_minutes,
    start_time_seconds: start_time_seconds,

    end_time_hours: end_time_hours,
    end_time_seconds: end_time_seconds,
    end_time_minutes: end_time_minutes,

    summary: summary,
    quote: quote,
    shared_by_user: shared_by_user,
    category_type: category_type,
    tags: tagsToSubmit,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //prevents the page refreshing
    try {
      let postSent = await addPost(postSubmission);
      setPostSuccessful(true);
      setNewContentFormShowing(!newContentFormShowing);
    } catch (error) {
      setPostSuccessful(false);
      console.error(error);
    }

    // since the form is submitted, we want to clear any fields that are not == ""
    // aka lets clear any entered data
  };

  // This import is necessary for module augmentation.
  // It allows us to extend the 'Props' interface in the 'react-select/base' module
  // and add our custom property 'myCustomProp' to it.

  return (
    <form
      onSubmit={handleSubmit}
      className=" mx-auto bg-blue-900 rounded-lg w-[94vw] text-center text-white"
    >
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
          name="sharing-okay"
          className="mx-2"
          value={check_sharing_okay}
          required
          onClick={() => setCheck_sharing_okay(!check_sharing_okay)}
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
              onClick={() => setCategory_type(contentTypeItem)}
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
          className="w-4/6 text-black"
          placeholder="ex: https://www"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          pattern="https://.*"

          // disabled={sessionFromServer ? "" : "disabled"}
        />
      </label>
      {/* ################## Review ################## */}
      <label
        className="font-bold block mt-4"
        htmlFor="link"
      >
        <span className="bg-red-500 text-white px-2">
          {" "}
          You must enter a summary, quote or both*{" "}
        </span>

        <span className="bg-100devs banner"> Summary </span>
        <textarea
          className="w-5/6 text-black"
          placeholder="Write a summary here"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </label>

      {/* ################## Quote ################## */}
      <label
        className="font-bold block mt-4"
        htmlFor="link"
      >
        <span className="block bg-100devs banner"> Quote </span>
        <textarea
          className="w-5/6 text-black"
          placeholder="type a quote here"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />
      </label>

      {/* ################## TIME START ################## */}

      {category_type === "video-or-podcast" && (
        <fieldset className="flex justify-center">
          <legend className="bg-100devs banner">
            Please Enter a Starting Time:{" "}
          </legend>

          <FormInputs
            label="Hours"
            type="number"
            inputname="starting-time-hours"
            inputid="hoursStartingInput"
            placeholder="00"
            value={start_time_hours}
            onChange={(e) => setStart_time_hours(e.target.value)}
          />

          <FormInputs
            label="Minutes"
            type="number"
            inputname="starting-time-minutes"
            inputid="minutesStartingInput"
            placeholder="00"
            value={start_time_minutes}
            onChange={(e) => setStart_time_minutes(e.target.value)}
          />

          <FormInputs
            label="Seconds"
            type="number"
            inputname="starting-time-seconds"
            inputid="secondsStartingInput"
            placeholder="00"
            value={start_time_seconds}
            onChange={(e) => setStart_time_seconds(e.target.value)}
          />
        </fieldset>
      )}

      {/* ################## TIME END ################## */}

      {category_type === "video-or-podcast" && (
        <fieldset className="flex justify-center">
          <legend className="bg-100devs banner">
            Please Enter a Ending Time:{" "}
          </legend>

          <FormInputs
            label="Hours"
            type="number"
            inputname="ending-time-hours"
            inputid="hoursEndingInput"
            placeholder="00"
            value={end_time_seconds}
            onChange={(e) => setEnd_time_hours(e.target.value)}
          />

          <FormInputs
            label="Minutes"
            type="number"
            inputname="ending-time-minutes"
            inputid="minutesEndingInput"
            placeholder="00"
            value={end_time_seconds}
            onChange={(e) => setEnd_time_seconds(e.target.value)}
          />

          <FormInputs
            label="Seconds"
            type="number"
            inputname="ending-time-seconds"
            inputid="secondsEndingInput"
            placeholder="00"
            value={end_time_seconds}
            onChange={(e) => setEnd_time_seconds(e.target.value)}
          />
        </fieldset>
      )}
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
        placeholder="If you type in the tags field, it will filter the tags"
        onChange={(option) => {
          setToSubmitTags(option.map((obj) => obj.value));
        }}
        //Options object has 3 properties, label, value and key
        //we grab value because that has the tags unique id
      />

      <NotifsTwoPossibilities
        determiningFactor={postSuccessful}
        firstText="Post successfully Sent!"
        secondText="There was an error with submitting your post"
      />

      <input
        type="hidden"
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
};

export default NewPostForm;
