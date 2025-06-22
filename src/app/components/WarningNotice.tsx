import React from "react";

type WarningNoticeType = {
  text: string;
  className: string;
};
export default function WarningNotice({ text, className }: WarningNoticeType) {
  return (
    <span
      className={`warning block w-32 mb-2 px-2 border-2 py-1 font-bold border-white ${className}`}
    >
      {" "}
      {text}{" "}
    </span>
  );
}
