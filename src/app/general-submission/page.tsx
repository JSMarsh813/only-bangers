"use server";

import React from "react";
import NewPostForm from "../components/form/NewPostForm";

import {
  getTags,
  getCategoriesAndTags,
} from "@/server-actions/grabData/grabbingData";

export default async function page() {
  const tagList = await getTags()
    .then((data) => data)
    .catch((error) =>
      console.error(
        "An error occured in getTags in the general submission component",
        error,
      ),
    );

  const categoriesAndTags = await getCategoriesAndTags()
    .then((data) => data)
    .catch((error) =>
      console.error("An error occured in categoriesAndTags", error),
    );
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
