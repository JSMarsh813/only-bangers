import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";

import ToggeableAlert from "../ToggeableAlert";

export default function FlagButtonAndLogic({
  signedInUsersId,
  userHasAlreadyReportedThis,
  userIsTheCreator,
  FlagIconStyling,
  FlagIconTextStyling,
  setFlagFormIsToggled,
  flagFormIsToggled,
  flaggedCount,
  setFlaggedCount,
  flagIconClickedByNewUser,
  setFlagIconClickedByNewUser,
}) {
  let [messageFromFunction, setMessageFromFunction] = useState([]);
  let flaggedColor =
    userHasAlreadyReportedThis || flagIconClickedByNewUser ? "red" : "#87ceeb";

  const toggleFlagColorAndNumber = () => {
    if (flagIconClickedByNewUser == true) {
      setFlaggedCount((flaggedCount -= 1));
    } else {
      setFlaggedCount((flaggedCount += 1));
    }

    setFlagIconClickedByNewUser(!flagIconClickedByNewUser);
  };

  const handleFlagged = (e) => {
    if (!signedInUsersId) {
      setMessageFromFunction(["You must sign in to flag content", "error"]);

      return;
    }

    if (userHasAlreadyReportedThis) {
      setMessageFromFunction([
        "We are in the process of reviewing your report. This content cannot be flagged again until the prior report is reviewed",
        "error",
      ]);
      return;
    }
    if (userIsTheCreator) {
      setMessageFromFunction(["You cannot flag your own content 😜", "error"]);
      return;
    } else {
      setFlagFormIsToggled(!flagFormIsToggled);
      toggleFlagColorAndNumber();
    }
  };

  return (
    <>
      <div className="block text-center my-auto">
        <label id="flaggedbutton">
          <input
            type="button"
            onClick={handleFlagged}
            htmlFor="flaggedbutton"
          />

          <FontAwesomeIcon
            icon={faFlag}
            className={`${FlagIconStyling}`}
            color={flaggedColor}
          />

          <span className={`${FlagIconTextStyling}`}>{flaggedCount}</span>
        </label>
      </div>
      <div className="w-full">
        {messageFromFunction[0] && (
          <ToggeableAlert
            text={messageFromFunction[0]}
            successfulOrNot={messageFromFunction[1] === "success"}
            setToggleState={setMessageFromFunction}
            toggleState={[]}
          />
        )}
      </div>
    </>
  );
}
