import React from "react";
import GeneralButton from "./GeneralButton";

export default function ToggeableAlert({
  text,
  successfulOrNot,
  setToggleState,
  toggleState,
}) {
  return (
    <div
      className={`p-4 ${
        successfulOrNot ? "bg-green-700" : "bg-red-700"
      } text-white text-center max-w-5xl mx-auto`}
    >
      <p className="self-center">{text}</p>

      <GeneralButton
        text="Close"
        className="mx-auto bg-yellow-300 text-blue-800 border-b-yellow-700"
        onClick={() => setToggleState(!toggleState)}
      />
    </div>
  );
}
