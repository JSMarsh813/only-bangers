"use server";

import React from "react";
import NewPostForm from "../components/form/NewPostForm";
import conf from "@/config/envConfig";
import axios from "axios";

async function getTags() {
  //tags will not change so we are caching it
  "use cache";
  try {
    let tagsDataForNewPostForm = await axios.get(
      `${conf.baseFetchUrl}/api/tags`,
    );

    let { tagList } = tagsDataForNewPostForm.data;
    return tagList;
  } catch (error) {
    console.error("Error fetching data getTags on root page:", error);
    return [];
  }
}

export default async function page() {
  let tagList = await getTags();
  return (
    <div>
      <NewPostForm
        tagList={tagList}
        // setStatusOfSubmission={setStatusOfSubmission}
      />
    </div>
  );
}
