import React from "react";

export default function WideDivider({ heading }) {
  return (
    <h3
      className="text-xl md:text-3xl font-semibold py-4 text-center  bg-blue-950 text-white
     border-y-4 border-blue-200"
    >
      {heading}
    </h3>
  );
}
