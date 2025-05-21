"use client";
import { useState, useEffect, useActionState } from "react";
import Select, { StylesConfig } from "react-select";
import GeneralButton from "../GeneralButton";
import RequiredSpan from "./RequiredSpan";
import CategoriesAndTagsCheatSheet from "./CategoriesAndTagsCheatSheet";

export default function TagFormSection({
  categoriesAndTags,
  tagList,
  shared_by_user,
  //state from parent component:
  setTagsValidated,
  tagsToSubmit,
  setToSubmitTags,
}) {
  const [tagsCheatSheetToggled, setTagsCheatSheetToggled] = useState(true);

  // ######## Validation function ###############

  const validationTagsMustIncludeContentType = function () {
    let contentTypeTagsIds = [];

    if (categoriesAndTags.length === 0) {
      return;
    }

    for (let i = 0; i < categoriesAndTags.length; i++) {
      if (categoriesAndTags[i].$id === "6826d137001dea87b9f8") {
        contentTypeTagsIds =
          categoriesAndTags[i].tags.map((tag) => tag.$id) || [];
      }
    }
    if (tagsToSubmit.some((tag) => contentTypeTagsIds.includes(tag.value))) {
      setTagsValidated(true);
    } else {
      setTagsValidated(false);
    }
  };

  // ######## do Validation when tagsToSubmitChanges ###############

  useEffect(() => {
    validationTagsMustIncludeContentType();
  }, [tagsToSubmit]);

  // ######## Logic for when tags Change ###############

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

  return (
    <section>
      <label
        className="font-bold block mt-4 "
        htmlFor="tagsForPost"
      >
        <span className="bg-blue-800 banner"> Tags </span>
      </label>

      <RequiredSpan />

      <span className="bg-red-700 font-bold text-white   my-4 mx-auto px-4 py-1">
        You must select at least 1 of the "content type" tags
      </span>

      <p className="my-2">
        You can use the input box and/or the checkboxes to select tags
      </p>

      <Select
        className={`text-black mb-4`}
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
      />

      <GeneralButton
        text="Toggle Tag List"
        className="bg-yellow-300 text-blue-900 border-yellow-700"
        type="button"
        onClick={() => setTagsCheatSheetToggled(!tagsCheatSheetToggled)}
      />

      <CategoriesAndTagsCheatSheet
        category={categoriesAndTags}
        IsOpen={tagsCheatSheetToggled}
        handleTagsChange={handleTagsChange}
        tagsToSubmit={tagsToSubmit}
      />
    </section>
  );
}
