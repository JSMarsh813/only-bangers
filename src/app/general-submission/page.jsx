"use server";

import React from "react";
import NewPostForm from "../components/form/NewPostForm";
import conf from "@/config/envConfig";
import axios from "axios";

import { getTags } from "@/server-actions/grabData/grabbingData";

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
