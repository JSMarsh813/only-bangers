"use client";
import { useState, useEffect, useActionState } from "react";
import Select, { StylesConfig } from "react-select";
import GeneralButton from "../GeneralButton";
import RequiredSpan from "./RequiredSpan";
import CategoriesAndTagsCheatSheet from "./CategoriesAndTagsCheatSheet";

type TagFormSectionType = {
  categoriesAndTags: CategoriesWithTagsType[];
  tagList: TagType[];
  shared_by_user: string;

  setTagsValidated: React.Dispatch<React.SetStateAction<boolean>>;

  tagsToSubmit: TagsToSubmitType[];

  setToSubmitTags: React.Dispatch<React.SetStateAction<TagsToSubmitType[]>>;
};

export default function TagFormSection({
  categoriesAndTags,
  tagList,
  shared_by_user,
  setTagsValidated,
  tagsToSubmit,
  setToSubmitTags,
}: TagFormSectionType) {
  const [tagsCheatSheetToggled, setTagsCheatSheetToggled] = useState(true);

  // ######## Validation function ###############

  const validationTagsMustIncludeContentTypeTags = function () {
    if (categoriesAndTags.length === 0) {
      return;
    }
    const categoryIdForContentTypeTags = "6826d137001dea87b9f8";

    let tagsInContentCategorysAsTheirIds: string[] = [];

    for (let i = 0; i < categoriesAndTags.length; i++) {
      //grabbing all the current ids for tags that exist in the category that's called Content Type (Ex: video, podcast, website)
      if (categoriesAndTags[i].$id === categoryIdForContentTypeTags) {
        tagsInContentCategorysAsTheirIds =
          categoriesAndTags[i].tags.map((tag) => tag.$id) || [];
      }
    }

    if (
      tagsToSubmit.some((tag) =>
        tagsInContentCategorysAsTheirIds.includes(tag.value),
      )
    ) {
      setTagsValidated(true);
    } else {
      setTagsValidated(false);
    }
  };

  // ######## do Validation when tagsToSubmitChanges ###############

  useEffect(() => {
    validationTagsMustIncludeContentTypeTags();
  }, [tagsToSubmit]);

  // ######## Logic for when tags Change ###############

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //since e.target is looking at a checkbox input element
    //checked is a boolean property only available on HTMLInputElement. That narrows things down for type safety and IntelliSense.

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
        You must select at least 1 of the &quot;content type&quot; tags
      </span>

      <p className="my-2">
        You can use the input box and/or the checkboxes to select tags
      </p>

      <Select
        className={`text-black mb-4`}
        id="tagsForPost"
        isDisabled={shared_by_user === "guest"}
        options={tagList.map((option) => ({
          label: option.tag_name ?? "unknown Tag",
          value: option.$id,
          key: option.$id,
        }))}
        //option.tag_name is possibliy undefined but react-select demands label to always be a string, so we have "unknown tag" as a fallback

        //{"label":"negotiating-job-offer",
        // "value":"67b23e77002cac41bef9",
        // "key":"67b23e77002cac41bef9"}
        value={tagsToSubmit}
        isMulti
        required
        isSearchable
        onChange={(selectedOptions) => {
          setToSubmitTags(selectedOptions ? [...selectedOptions] : []);
        }}
      />
      {/* typescript error
      // onChange={(selectedOptions) => {
          setToSubmitTags(selectedOptions || []);
        }}
      Error: Argument of type 'MultiValue<TagsToSubmitType>' is not assignable to parameter of type 'SetStateAction<TagsToSubmitType[]>'.

  The type 'readonly TagsToSubmitType[]' is 'readonly' and cannot be assigned to the mutable type 'TagsToSubmitType[]'.ts(2345)

  //why did this array become readonly?
 // React-select’s onChange for a multi-select returns a value with the type ofreadonly TagsToSubmitType[]  aka MultiValue<TagsToSubmitType>
 // this is a readonly array
 //However, the react state setter setToSubmitTags expects a mutable TagsToSubmitType[] array 

 // Solution: so we have to undo react-select making it a readonly array, by using the spread operator
 // [...selectedOptions]

 // why does react-select make it read only?
 //1. Immutability/prevent bugs = safer code, so you can't accidently mutate the original array
 //2. React (and functional programming in general) thrives on pure functions. By using readonly, react-select nudges you toward creating new arrays (with map, filter, spread, etc.) instead of mutating existing ones.
   */}

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
