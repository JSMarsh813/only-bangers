import React from "react";

export default function WarningNotice({ text }) {
  return (
    <span className="warning block w-32 mb-2 mx-auto px-2 border-2 py-1 font-bold border-white">
      {" "}
      {text}{" "}
    </span>
  );
}
