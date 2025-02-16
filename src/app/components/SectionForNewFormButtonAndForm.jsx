"use client";

import React from "react";
import { useState } from "react";
import NewPostForm from "./form/NewPostForm";
import GeneralButton from "./GeneralButton";
export default function SectionForNewFormButtonAndForm({ tags }) {
  const [newContentFormShowing, setNewContentFormShowing] = useState(false);

  return (
    <div>
      <GeneralButton
        text="Submit New Content"
        className=""
        onClick={() => setNewContentFormShowing(!newContentFormShowing)}
        type="button"
      />
      <span>{`this is ${newContentFormShowing}`}</span>
      {newContentFormShowing && <NewPostForm tagList={tags} />}
    </div>
  );
}
