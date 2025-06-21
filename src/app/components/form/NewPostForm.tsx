"use client";
import { useState, useEffect, useActionState } from "react";
import { addPost } from "../../../server-actions/postActions";
import Select, { StylesConfig } from "react-select";
import TimeFormInputs from "./TimeFormInputs";
import GeneralButton from "../GeneralButton";
import { useUser } from "../context-wrappers/UserInfo";
import CharactersLeftInInput from "./CharactersLeftInInput";
import RequiredSpan from "./RequiredSpan";
import CategoriesAndTagsCheatSheet from "./CategoriesAndTagsCheatSheet";
import WarningNotice from "../WarningNotice";
import TagFormSection from "./TagFormSection";

type TagType = {
  $collectionId?: string;
  $createdAt?: string;
  $databaseId?: string;
  $id: string;
  $permissions?: Array<string>;
  $sequence?: string;
  $updatedAt?: string;
  tag_name: string;
};
// $collectionId:"67c80eb80036981441a2"
// $createdAt:"2025-03-05T08:49:52.870+00:00"
// $databaseId:"67c80e49000a8d4301f9"
// $id:"67c810320013a4dcb1d4"
// $permissions:[]
// $sequence:"1"
// $updatedAt:"2025-05-16T08:14:23.622+00:00"
// tag_name:"service or retail"

type CategoriesAndTagsType = {
  $collectionId?: string;
  $createdAt?: string;
  $databaseId?: string;
  $id: string;
  $permissions?: Array<string>;
  $sequence?: string;
  $updatedAt?: string;
  category_name: string;
};

// $collectionId : "67c80e81003245661e06"
// $createdAt:"2025-03-05T08:46:58.964+00:00"
// $databaseId:"67c80e49000a8d4301f9"
// $id:"67c80f840018b174e6e4"
// $permissions:[]
// $sequence:"1"
// $updatedAt:"2025-03-05T09:10:56.445+00:00"
// category_name: "managing_blockers"

type NewPostFormType = {
  tagList: TagType[];
  categoriesAndTags: CategoriesAndTagsType[];
};

type FormStateType = {
  check_sharing_okay: boolean | "error" | "No value found";
  resource_url: string | "error" | "No value found";
  start_time_hours?: number;
  start_time_minutes?: number;
  start_time_seconds?: number;
  summary: string | "error" | "No value found";
  quote?: string | "error" | "No value found";
  shared_by_user: string | "error" | "No value found";
  has_a_play_button: "yes" | "no" | "error" | "No value found";
  tags: string[] | "No value found";
  isUrlEmbedded: boolean | "error" | "No value found";
};

// data.state
// data.message

type PostResponseType = {
  data: FormStateType;
  //copyOfSubmissionData
  message: string;
};

type ReturnedDataType = [string, string | number | boolean | string[]][];

export default function NewPostForm({
  tagList,
  categoriesAndTags,
}: NewPostFormType) {
  type TagsToSubmitType = {
    label: string;
    value: string | number;
    key: string | number;
  };

  const [returnedData, setReturnedData] = useState<ReturnedDataType | null>(
    null,
  );
  const [state, action, isPending] = useActionState<
    PostResponseType | null,
    FormData
  >(addPost, null);
  // the state will be equal to the FormStateType typing setup or it will be null
  // FormData will use the FormData typing
  //(addpost === action handler, null === intital state)

  const [tagsValidated, setTagsValidated] = useState(false);
  const [tagsToSubmit, setToSubmitTags] = useState<TagsToSubmitType[]>([]);
  //this setState can be an empty array, or be an array of any number of TagsToSubmitType objects
  const [summaryCharacterCount, setSummaryCharacterCount] = useState(0);
  const [quoteCharacterCount, setQuoteCharacterCount] = useState(0);
  const [hasAPlayButton, setHasAPlayButton] = useState("no");
  const [shared_by_user, setShared_by_user] = useState("guest");

  const userInfo = useUser();

  const { currentUsersInfo, other } = userInfo;
  const { user_name, profile_image, $id } = currentUsersInfo;

  const userId = user_name != "guest" ? $id : null;

  useEffect(() => {
    if (userId) {
      setShared_by_user(userId);
    }
  }, [userId]);

  useEffect(() => {
    // did this useEffect because otherwise the tags in the "copy of submitted data" would change to "unknown tags" after submission
    // cause: if the user clicked on and off tags after form submission, it would change the tags to "unknown tags" in the report
    // now the returned data will only change if the submitted data (state) changes
    if (state && "data" in state && state.data !== null) {
      setReturnedData(changeSubmittedDataIntoViewableList(state));
      setToSubmitTags([]);
    }
  }, [state]);

  function changeSubmittedDataIntoViewableList(state: PostResponseType | null) {
    if (!state?.data) return [];
    //change into an array

    // tags have to be changed from their id back to their tag_name
    state.data.tags = Array.isArray(state.data.tags) //state.data.tags should always be an array, but just in case there is a weird edge case check that its an array. if its not, return an empty array
      ? state.data.tags.map((tagId: string | number) => {
          const tagObjectInTagList = tagList.find((tag) => tag.$id === tagId);
          return tagObjectInTagList
            ? tagObjectInTagList.tag_name
            : "Unknown Tag"; // Fallback if tag is not found
        })
      : [];
    const submissionTurnedIntoAnArray = Object.entries(state.data);

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
          Thank you for submitting content, it&apos;s appreciated!
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
            defaultValue="https://www.google.com"
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

      {/* ########### DOES CONTENT HAVE A PLAY BUTTON ############ */}
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

      {/* we want the form to see the default value of 0, but we want it hidden from screenreaders and screens if the "has a play button" button is not clicked */}
      <fieldset
        className={`${
          hasAPlayButton !== "yes" ? "hidden" : ""
        } grid justify-center col-span-1`}
      >
        <legend className=" bg-blue-800 banner">
          Starting time (if applicable):
        </legend>

        <section>
          <TimeFormInputs
            label="Hours"
            type="number"
            inputname="start_time_hours"
            inputid="hoursStartingInput"
            defaultValue="0"
            placeholder="00"
          />

          <TimeFormInputs
            label="Minutes"
            type="number"
            inputname="start_time_minutes"
            inputid="minutesStartingInput"
            defaultValue="0"
            placeholder="00"
          />

          <TimeFormInputs
            label="Seconds"
            type="number"
            inputname="start_time_seconds"
            inputid="secondsStartingInput"
            defaultValue="0"
            placeholder="00"
          />
        </section>
      </fieldset>

      {/* ################## TAGS ################## */}

      <TagFormSection
        categoriesAndTags={categoriesAndTags}
        tagList={tagList}
        setTagsValidated={setTagsValidated}
        tagsToSubmit={tagsToSubmit}
        setToSubmitTags={setToSubmitTags}
        shared_by_user={shared_by_user}
      />

      {/* 
the select input is still very buggy for useActionState, I used state and pushed that state into a hidden input as a workaround
      https://github.com/facebook/react/issues/32362
      https://github.com/facebook/react/issues/30580 
      */}

      {/* HTML form inputs with type="hidden" only accept strings, so you need to join the values if you're submitting an array. */}
      <input
        type="hidden"
        name="tags"
        value={tagsToSubmit.map((obj) => obj.value).join(",")}
      />

      {/* ################## USER ID ################## */}

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
            aria-live="polite"
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
            className="w-fit mt-4 mx-auto"
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
