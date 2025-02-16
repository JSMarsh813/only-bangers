"use client";
import { useState } from "react";
import { addPost } from "../../actions/postActions";
import Select from "react-select";
import FormInputs from "../form/FormInputs";

const NewPostForm = ({ tagList }: any) => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState(tagList);
  const [url, setNewUrl] = useState("");
  const [quote, setQuote] = useState("");
  const contentTypesList = [
    "blog-or-article",
    "video-or-podcast",
    "social-media-post",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //prevents the page refreshing
    if (content.trim() !== "") {
      await addPost(content);
      // since the form is submitted, we want to clear any fields that are not == ""
      // aka lets clear any entered data
      setContent("");
    }
  };

  // This import is necessary for module augmentation.
  // It allows us to extend the 'Props' interface in the 'react-select/base' module
  // and add our custom property 'myCustomProp' to it.

  return (
    <form
      onSubmit={handleSubmit}
      className=""
    >
      {/* ########## Checkbox ############ */}
      <div>
        <p> Please confirm that this content is:</p>

        <ul className="list-disc">
          <li key="list-disc-1">
            accessible through a publically available url link{" "}
          </li>
          <li key="list-disc-2"> not discussing a private conversation </li>
          <li key="list-disc-3"> not related to office hours or tea spills </li>
          <li key="list-disc-4">fair use / free</li>
        </ul>

        <input
          type="checkbox"
          id="sharing-check"
          name="sharing-okay"
          className="mr-2"
          value="true"
          required
        />
        <label htmlFor="sharing-check">
          This content meets the above guidelines
        </label>
      </div>

      {/* ########### CONTENT TYPE ############ */}
      <fieldset>
        <legend className="mx-auto">What type of Content is this:</legend>
        <span className="text-red-500"> Required * </span>
        {contentTypesList.map((contentTypeItem, index) => (
          <label htmlFor={contentTypeItem}>
            {contentTypeItem}
            <input
              type="radio"
              key={`${contentTypeItem}${index}`}
              id={contentTypeItem}
              name="content-type"
              value={contentTypeItem}
              required
            />
          </label>
        ))}
      </fieldset>

      {/* ########## url link ############ */}
      <label
        className="font-bold block mt-4"
        htmlFor="url"
      >
        <span className="block">Url Link</span>
        <input
          type="url"
          id="urlInput"
          className="w-4/6"
          placeholder="ex: https://www"
          value={url}
          onChange={(e) => setNewUrl(e.target.value)}
          pattern="https://.*"

          // disabled={sessionFromServer ? "" : "disabled"}
        />
      </label>
      {/* ################## Review ################## */}
      <label
        className="font-bold block mt-4"
        htmlFor="link"
      >
        <span className="block"> Summary </span>
        <textarea
          value={content}
          className="w-5/6"
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a summary here"
        />
      </label>

      {/* ################## Quote ################## */}
      <label
        className="font-bold block mt-4"
        htmlFor="link"
      >
        <span className="block"> Quote </span>
        <textarea
          value={quote}
          className="w-5/6"
          onChange={(e) => setQuote(e.target.value)}
          placeholder="type a quote here"
        />
      </label>

      {/* ################## TIME START ################## */}
      <fieldset className="flex justify-center">
        <legend className="mx-auto my-4">Please Enter a Starting Time: </legend>

        <FormInputs
          label="Hours"
          type="number"
          inputname="starting-time-hours"
          inputid="hoursStartingInput"
          placeholder="00"
        />

        <FormInputs
          label="Minutes"
          type="number"
          inputname="starting-time-minutes"
          inputid="minutesStartingInput"
          placeholder="00"
        />

        <FormInputs
          label="Seconds"
          type="number"
          inputname="starting-time-seconds"
          inputid="secondsStartingInput"
          placeholder="00"
        />
      </fieldset>

      {/* ################## TIME END ################## */}
      <fieldset className="flex justify-center">
        <legend className="mx-auto my-4">Please Enter a Ending Time: </legend>

        <FormInputs
          label="Hours"
          type="number"
          inputname="ending-time-hours"
          inputid="hoursEndingInput"
          placeholder="00"
        />

        <FormInputs
          label="Minutes"
          type="number"
          inputname="ending-time-minutes"
          inputid="minutesEndingInput"
          placeholder="00"
        />

        <FormInputs
          label="Seconds"
          type="number"
          inputname="ending-time-seconds"
          inputid="secondsEndingInput"
          placeholder="00"
        />
      </fieldset>

      {/* ################## TAGS ################## */}
      <label
        className="font-bold block mt-4"
        htmlFor="tagsForPost"
      >
        Tags
      </label>
      <Select
        className="text-black mb-4"
        id="tagsForPost"
        options={tags.map((option: any) => ({
          label: option.tag_name,
          value: option.$id,
          key: option.$id,
        }))}
        isMulti
        isSearchable
        placeholder="If you type in the tags field, it will filter the tags"
        onChange={(option: any) => setTags(option.map((tag: any) => tag.$id))}
      />
      <button type="submit">Add Note</button>
    </form>
  );
};

export default NewPostForm;
