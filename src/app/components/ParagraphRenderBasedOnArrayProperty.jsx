import React from "react";
import ImportantSpans from "./ImportantSpans";

export default function ParagraphRenderBasedOnArrayProperty({ content, text }) {
  return (
    <p className="pb-2">
      <ImportantSpans text={text} />
      {content[0] == null
        ? `no ${text}`
        : content.map((tag) => tag.tag_name).join(",  ")}
    </p>
  );
}
