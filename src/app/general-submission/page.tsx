"use server";

import React from "react";
import NewPostForm from "../components/form/NewPostForm";

import {
  getTags,
  getCategoriesAndTags,
} from "@/server-actions/grabData/grabbingData";

export default async function page() {
  //tagList starts as string[] | [] | never[] but we want to make sure its type is tagType (on object of strings and one array of strings)

  const tagList = await getTags()
    .then((data) => (Array.isArray(data) ? (data as TagType[]) : []))
    .catch((error) => {
      console.error(
        "An error occured in getTags in the general submission component",
        error,
      );
      return [];
    });

  const categoriesAndTags = await getCategoriesAndTags()
    .then((data) =>
      Array.isArray(data) ? (data as CategoriesWithTagsType[]) : [],
    )
    .catch((error) => {
      console.error("An error occured in categoriesAndTags", error);
      return [];
    });

  console.log(`this is categoriesAndTags ${JSON.stringify(categoriesAndTags)}`);
  return (
    <div>
      <NewPostForm
        tagList={tagList}
        categoriesAndTags={categoriesAndTags}
        // setStatusOfSubmission={setStatusOfSubmission}
      />
    </div>
  );
}
