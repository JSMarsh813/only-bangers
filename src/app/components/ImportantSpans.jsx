import React from "react";

export default function ImportantSpans({ text }) {
  return (
    <span className="text-white flex-none font-semibold bg-blue-950 rounded-md border-2 border-blue-300 px-1 py-2 mr-2 shadow-blue-400 shadow-inner inline-block h-12 w-24 text-center">
      {`${text}`}
    </span>
  );
}
