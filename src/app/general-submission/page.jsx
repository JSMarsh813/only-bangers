"use server";

import React from "react";
import NewPostForm from "../components/form/NewPostForm";
import conf from "@/config/envConfig";
import axios from "axios";

import {
  getTags,
  getCategoriesAndTags,
} from "@/server-actions/grabData/grabbingData";

export default async function page() {
  let tagList = await getTags()
    .then((data) => data)
    .catch((error) =>
      console.error(
        "An error occured in getTags in the general submission component",
        error,
      ),
    );

  const categoriesList = await getCategoriesAndTags()
    .then((data) => data)
    .catch((error) =>
      console.error("An error occured in categoriesList", error),
    );
  return (
    <div>
      <NewPostForm
        tagList={tagList}
        getCategoriesAndTags={categoriesList}
        // setStatusOfSubmission={setStatusOfSubmission}
      />
    </div>
  );
}
