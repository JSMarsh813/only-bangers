"use client";
import { useState, useEffect, useActionState } from "react";
import { addPost } from "../../../server-actions/postActions";
import Select, { StylesConfig } from "react-select";
import FormInputs from "./FormInputs";
import GeneralButton from "../GeneralButton";
import { useUser } from "../context-wrappers/UserInfo";
import CharactersLeftInInput from "./CharactersLeftInInput";
import RequiredSpan from "./RequiredSpan";

export default function NewPostForm({ tagList }) {
  const [returnedData, setReturnedData] = useState(null);
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

  const [summaryCharacterCount, setSummaryCharacterCount] = useState(0);
  const [quoteCharacterCount, setQuoteCharacterCount] = useState(0);

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

  let { currentUsersInfo, other } = userInfo;
  let { user_name, profile_image, $id } = currentUsersInfo;

  let userId = user_name != "guest" ? $id : null;

  useEffect(() => {
    if (userId) {
      setShared_by_user(userId);
    }
  }, [userId]);

  useEffect(() => {
    // did this useEffect because otherwise the tags in the "copy of submitted data" would change to "unknown tags" after submission
    // cause: if the user clicked on and off tags after form submission, it would change the tags to "unknown tags" in the report
    // now the returned data will only change if the submitted data (state) changes
    if (state?.data && state.data !== null) {
      setReturnedData(changeSubmittedDataIntoViewableList(state));
    }
  }, [state]);

  function changeSubmittedDataIntoViewableList(state) {
    if (!state?.data) return [];
    //change into an array

    // tags have to be changed from their id back to their tag_name
    state.data.tags = Array.isArray(state.data.tags) //state.data.tags should always be an array, but just in case there is a weird edge case check that its an array. if its not, return an empty array
      ? state.data.tags.map((tagId) => {
          const tagObjectInTagList = tagList.find((tag) => tag.$id === tagId);
          return tagObjectInTagList
            ? tagObjectInTagList.tag_name
            : "Unknown Tag"; // Fallback if tag is not found
        })
      : [];
    let submissionTurnedIntoAnArray = Object.entries(state.data);

    return submissionTurnedIntoAnArray;
  }

  return (
    <form
      action={action}
      className=" mx-auto bg-blue-950 rounded-lg w-[94vw] text-center text-white pt-2"
    >
      <div className="banner bg-blue-800 ">
        <h2 className="text-2xl"> Submitting Content</h2>

        <p className="mt-2">
          Thank you for submitting content, it's appreciated!
        </p>

        {shared_by_user === "guest" && (
          <p className="bg-red-700 w-fit mx-auto px-10 py-2">
            You must sign in to enable this form 😉
          </p>
        )}
      </div>

      {/* ########## Checkbox ############ */}
      <fieldset className="my-6">
        <legend className=" bg-blue-800 banner">
          Please confirm that this content:
        </legend>

        <div className="mx-auto max-w-[700px]  ">
          <ul className="list-disc list-inside text-left gap-4 grid justify-between ">
            <li key="list-disc-1">
              Is accessible through a publically available url link{" "}
            </li>

            <li key="list-disc-3">
              Not discussing a private conversation or a private event (ex:
              office hours or tea spills)
            </li>
            <li key="list-disc-4">
              The content is not intended for a limited audience (ex: please do
              not share a social media post that is clearly intended for a small
              group)
            </li>
            <li key="list-disc-5">
              Is not code weenie content (aka content which demands that theres
              only one right way to code, strong opinions are okay 😉)
            </li>
          </ul>
        </div>
        <RequiredSpan />
        <input
          type="checkbox"
          id="sharing-check"
          name="check_sharing_okay"
          className="mx-2"
          required
          disabled={shared_by_user === "guest"}
        />
        <label htmlFor="sharing-check">
          This content meets the above guidelines
        </label>
      </fieldset>
      {/* ########### CONTENT TYPE ############ */}
      <fieldset disabled={shared_by_user === "guest"}>
        <legend className=" bg-blue-800 banner">
          What type of Content is this:
        </legend>
        <RequiredSpan />

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
        <legend className=" bg-blue-800 banner">Url Link </legend>

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
            default="https://www.google.com"
            placeholder="ex: https://"
            onChange={(e) => {
              e.target.value = e.target.value.trim();
            }}
            pattern="https://.*"
            required

            // disabled={sessionFromServer ? "" : "disabled"}
          />
        </label>
      </fieldset>
      {/* ################## summary ################## */}
      <label
        className="font-bold block mt-4"
        htmlFor="summary"
      >
        <span className=" bg-blue-800 banner"> Summary </span>
        <RequiredSpan />

        <textarea
          id="summary"
          name="summary"
          className="w-5/6 text-black"
          placeholder="Write a summary here"
          disabled={shared_by_user === "guest"}
          onChange={(e) => {
            setSummaryCharacterCount(e.target.value.length);
          }}
          maxLength={1500}
        />
        <CharactersLeftInInput
          characterCount={summaryCharacterCount}
          maxCharacterCount={1500}
        />
      </label>
      {/* ################## Quote ################## */}
      <label
        className="font-bold block mt-4"
        htmlFor="quote"
      >
        <span className="block bg-blue-800 banner"> Quote </span>
        <textarea
          id="quote"
          name="quote"
          className="w-5/6 text-black"
          placeholder="type a quote here"
          disabled={shared_by_user === "guest"}
          onChange={(e) => {
            setQuoteCharacterCount(e.target.value.length);
          }}
          maxLength={1500}
        />
        <CharactersLeftInInput
          characterCount={quoteCharacterCount}
          maxCharacterCount={1500}
        />
      </label>
      {/* ################## TIME START ################## */}
      {selectedContentType === "video-or-podcast" && (
        <fieldset className="grid justify-center col-span-1">
          <legend className=" bg-blue-800 banner">
            Please Enter a Starting Time:{" "}
          </legend>

          <p className="mb-4">
            {" "}
            If your submission applies to the entire video, then you can leave
            this blank and it will autopopulate as 00:00:00
          </p>

          <section>
            <FormInputs
              label="Hours"
              type="number"
              inputname="start_time_hours"
              inputid="hoursStartingInput"
              defaultValue="0"
              placeholder="00"
            />

            <FormInputs
              label="Minutes"
              type="number"
              inputname="start-time-minutes"
              inputid="minutesStartingInput"
              defaultValue="0"
              placeholder="00"
            />

            <FormInputs
              label="Seconds"
              type="number"
              inputname="start-time-seconds"
              inputid="secondsStartingInput"
              defaultValue="0"
              placeholder="00"
            />
          </section>
        </fieldset>
      )}

      {/* ################## TAGS ################## */}

      <label
        className="font-bold block mt-4 "
        htmlFor="tagsForPost"
      >
        <span className=" bg-blue-800 banner"> Tags </span>
        <RequiredSpan />
      </label>
      <Select
        className={`text-black mb-4 mx-6`}
        id="tagsForPost"
        isDisabled={shared_by_user === "guest"}
        options={tagList.map((option) => ({
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

      <input
        type="hidden"
        name="shared_by_user"
        value={shared_by_user}
      />
      <div className="">
        {isPending && (
          <p
            aria-live="polite"
            className="text-yellow-300"
          >
            Submitting...
          </p>
        )}

        {state?.message && (
          <section
            aria-live="polite "
            className={`blue-800 my-4 mx-4 py-6 border-4 ${
              state.message.includes("error")
                ? "border-red-300 shadow-red-400"
                : "border-green-300 shadow-green-400"
            } shadow-lg`}
          >
            <p
              className={`text-lg py-4 mb-4 shadow-md ${
                state.message.includes("error")
                  ? "border-red-300 shadow-red-400"
                  : "border-green-300 shadow-green-400"
              } bg-white text-blue-900 max-w-[850px] rounded-lg mx-auto font-bold`}
            >
              {state.message}
            </p>
            <span className="font-bold text-lg">
              {" "}
              Copy Of Your Submitted Data:{" "}
            </span>
            <ul className="mt-4">
              {returnedData !== null &&
                returnedData.map(([property, value]) => (
                  <li key={property}>
                    <span className="font-bold"> {`${property}:`} </span>
                    <span> {`${value}`} </span>
                  </li>
                ))}
            </ul>
          </section>
        )}

        <GeneralButton
          text={shared_by_user === "guest" ? "Submit (disabled)" : "Submit"}
          className="mx-auto bg-blue-700"
          type="submit"
          disabled={shared_by_user === "guest"}
        />
      </div>
    </form>
  );
}
