"use client";
import { useState, useEffect, useActionState } from "react";
import { addPost } from "../../../server-actions/postActions";
import Select, { StylesConfig } from "react-select";
import FormInputs from "./FormInputs";
import GeneralButton from "../GeneralButton";
import { useUser } from "../context-wrappers/UserInfo";
import CharactersLeftInInput from "./CharactersLeftInInput";
import RequiredSpan from "./RequiredSpan";
import CategoriesAndTagsCheatSheet from "./CategoriesAndTagsCheatSheet";
import WarningNotice from "../WarningNotice";

export default function NewPostForm({ tagList, getCategoriesAndTags }) {
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

  const [tagsValidated, setTagsValidated] = useState(false);
  const [tagsToSubmit, setToSubmitTags] = useState([]);
  const [summaryCharacterCount, setSummaryCharacterCount] = useState(0);
  const [quoteCharacterCount, setQuoteCharacterCount] = useState(0);
  const [hasAPlayButton, setHasAPlayButton] = useState("no");
  const [shared_by_user, setShared_by_user] = useState("guest");
  const [tagsCheatSheetToggled, setTagsCheatSheetToggled] = useState(true);

  const handleTagsChange = (e) => {
    console.log(e.target);
    const { id, value, checked } = e.target;

    // Is checkbox clicked?
    if (checked) {
      //if  so check if the tag does not exist in the tagsToSubmit state
      if (!tagsToSubmit.some((tag) => tag.value === id)) {
        setToSubmitTags([
          ...tagsToSubmit,
          { label: value, value: id, key: id },
        ]);
      }
    } else {
      // if the tag already exists in the tagsToSubmit state, then remove it from the tagsToSubmit state
      // since the tags checkbox's state relies on the tagsToSubmit state, this will also uncheck the checkbox
      setToSubmitTags(tagsToSubmit.filter((tag) => tag.value !== id));
    }
  };

  // const [postSuccessful, setPostSuccessful] = useState("");

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
      setToSubmitTags([]);
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

  const validationTagsMustIncludeContentType = function () {
    let contentTypeTagsIds = [];

    if (getCategoriesAndTags.length === 0) {
      return;
    }

    for (let i = 0; i < getCategoriesAndTags.length; i++) {
      if (getCategoriesAndTags[i].$id === "6826d137001dea87b9f8") {
        contentTypeTagsIds =
          getCategoriesAndTags[i].tags.map((tag) => tag.$id) || [];
      }
    }
    if (tagsToSubmit.some((tag) => contentTypeTagsIds.includes(tag.value))) {
      setTagsValidated(true);
    } else {
      setTagsValidated(false);
    }
  };
  useEffect(() => {
    validationTagsMustIncludeContentType();
  }, [tagsToSubmit]);

  const handleCategoriesAndTagsCheatSheet = function () {
    setTagsCheatSheetToggled(!tagsCheatSheetToggled);
  };

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

      {/* ########### CONTENT TYPE ############ */}
      <fieldset disabled={shared_by_user === "guest"}>
        <legend className=" bg-blue-800 banner">
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
          onChange={(e) => setHasAPlayButton(e.target.value)}
          className="mr-2"
        />

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
          onChange={(e) => setHasAPlayButton(e.target.value)}
          className="mr-2"
        />
      </fieldset>

      {/* ################## TIME START ################## */}
      {hasAPlayButton === "yes" && (
        <fieldset className="grid justify-center col-span-1">
          <legend className=" bg-blue-800 banner">
            Starting time (if applicable):
          </legend>

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
      </label>
      <RequiredSpan />
      <span className="bg-red-700 font-bold text-white   my-4 mx-auto px-4 py-1">
        You must select at least 1 of the "content type" tags
      </span>

      <p className="my-2">
        You can use the input box and/or the checkboxes to select tags
      </p>

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
        value={tagsToSubmit}
        isMulti
        required
        isSearchable
        onChange={(selectedOptions) => {
          setToSubmitTags(selectedOptions || []);
        }}
        // onChange={(option) => {
        //   setToSubmitTags(option.map((obj) => obj.label));
        //   //  setToSubmitTags(option.map((obj) => obj.value));
        // }}

        //Options object has 3 properties, label, value and key
        //we grab value because that has the tags unique id
      />
      <GeneralButton
        text="Toggle Tag List"
        className="bg-yellow-300 text-blue-900 border-yellow-700"
        type="button"
        onClick={handleCategoriesAndTagsCheatSheet}
      />

      <CategoriesAndTagsCheatSheet
        category={getCategoriesAndTags}
        IsOpen={tagsCheatSheetToggled}
        handleTagsChange={handleTagsChange}
        tagsToSubmit={tagsToSubmit}
      />

      {/* 
the select input is still very buggy for useActionState, I used state and pushed that state into a hidden input as a workaround
      https://github.com/facebook/react/issues/32362
      https://github.com/facebook/react/issues/30580 
      */}
      <input
        type="hidden"
        name="tags"
        value={tagsToSubmit.map((obj) => obj.value)}
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

        {!tagsValidated && (
          <WarningNotice
            className="w-fit mt-4"
            text="Select a tag under the content type tag category to enable the submit button"
          />
        )}
        <GeneralButton
          text={shared_by_user === "guest" ? "Submit (disabled)" : "Submit"}
          className="mx-auto bg-yellow-300 text-blue-950 border-yellow-700"
          type="submit"
          disabled={shared_by_user === "guest" || tagsValidated === false}
        />
      </div>
    </form>
  );
}
