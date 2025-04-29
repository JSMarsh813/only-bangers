import React, { useState, useEffect } from "react";

export default function CharactersLeftInInput({
  characterCount,
  maxCharacterCount,
}) {
  let remainingCharacters = maxCharacterCount - characterCount;
  const [charactersLeft, setCharactersLeft] = useState(true);

  useEffect(() => {
    if (remainingCharacters < 0) {
      setCharactersLeft(false);
    } else {
      setCharactersLeft(true);
    }
  }, [remainingCharacters]);

  return (
    <span className={`block w-64 mx-auto ${!charactersLeft && "bg-red-800"}`}>
      {remainingCharacters}/{maxCharacterCount} characters remaining
    </span>
  );
}
