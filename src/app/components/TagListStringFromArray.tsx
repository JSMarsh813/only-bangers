import React from "react";
import ImportantSpans from "./ImportantSpans";

export default function ParagraphRenderBasedOnArrayProperty({
  content,
  text,
}: {
  content: TagType[];
  text: string;
}) {
  let tagListToShow = "";

  if (content.length === 0) {
    tagListToShow = `no ${text}`;
  } else {
    const arrayOfTagsToString = content
      .map((tag) =>
        tag.tag_name ? tag.tag_name : "new tag please refresh to view",
      )
      .join(",  ");
    tagListToShow = arrayOfTagsToString;
  }

  //if content is an empty array, then show  `no ${text}`
  // else
  // if tag.tag_name exists show the tag name
  // otherwise show "new tag please refersh to view"
  return (
    <p className="pb-2">
      <ImportantSpans text={text} />

      {tagListToShow}
    </p>
  );
}
