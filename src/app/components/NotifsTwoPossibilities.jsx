import React from "react";

export default function NotifsTwoPossibilities({
  determiningFactor,
  firstText,
  secondText,
}) {
  return (
    <div>
      {/* ternary won't work because anything becomes truth or falsy aka "" is considered false, so they'd see the error message immediately */}
      {determiningFactor === true && (
        <div className="bg-green-500 w-fit mx-auto px-10 py-2">
          <p>{firstText}</p>
        </div>
      )}

      {determiningFactor === false && (
        <div className="bg-red-500 w-fit mx-auto px-10 py-2">
          <span>{secondText}</span>
        </div>
      )}
    </div>
  );
}
