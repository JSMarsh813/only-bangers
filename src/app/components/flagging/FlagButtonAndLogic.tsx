"use client";

import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";
import { useUser } from "../context-wrappers/UserInfo";
import ToggeableAlert from "../ToggeableAlert";

type FlagButtonAndLogicType = {
  FlagIconStyling: string;
  FlagIconTextStyling: string;
  flagFormIsToggled: boolean;
  userIsTheCreator: boolean;
  flaggedCount: number;
  flagIconClickedByNewUser: boolean;
  userHasAlreadyReportedThis: boolean;

  setFlagFormIsToggled: React.Dispatch<React.SetStateAction<boolean>>;

  setFlaggedCount: React.Dispatch<React.SetStateAction<number>>;

  setFlagIconClickedByNewUser: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FlagButtonAndLogic({
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
}: FlagButtonAndLogicType) {
  const { currentUsersInfo, ...other } = useUser();
  const signedInUsersId: string = currentUsersInfo.$id || "guest";

  const [showAlert, setShowAlert] = useState(true);

  const [messageFromFunction, setMessageFromFunction] = useState<string[]>([]);
  // holds an array of strings and initializes as []
  const flaggedColor =
    userHasAlreadyReportedThis || flagIconClickedByNewUser ? "red" : "#87ceeb";

  const toggleFlagColorAndNumber = () => {
    if (flagIconClickedByNewUser == true) {
      setFlaggedCount((flaggedCount -= 1));
    } else {
      setFlaggedCount((flaggedCount += 1));
    }

    setFlagIconClickedByNewUser(!flagIconClickedByNewUser);
  };

  const handleFlagged = (e: React.MouseEvent<HTMLButtonElement>) =>
    //MouseEvent<HTMLButtonElement> results in Type 'MouseEvent' is not generic

    //The global DOM MouseEvent (from the browser) is not generic, hence the error

    //so it was necessary to use the React version of this event type

    //React.MouseEvent<T> is a generic type that lets you specify the target element (T, like HTMLButtonElement)
    {
      setShowAlert(!showAlert);

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
        setMessageFromFunction([
          "You cannot flag your own content 😜",
          "error",
        ]);
        return;
      } else {
        setFlagFormIsToggled(!flagFormIsToggled);
        toggleFlagColorAndNumber();
      }
    };

  return (
    <>
      <div className="block text-center my-auto">
        <label htmlFor="flaggedbutton">
          <button
            onClick={handleFlagged}
            id="flaggedButton"
          >
            <FontAwesomeIcon
              icon={faFlag}
              className={`${FlagIconStyling}`}
              color={flaggedColor}
            />

            <span className={`${FlagIconTextStyling}`}>{flaggedCount}</span>
          </button>
        </label>
      </div>
      <div className="w-full">
        {messageFromFunction[0] && showAlert && (
          <ToggeableAlert
            text={messageFromFunction[0]}
            successfulOrNot={messageFromFunction[1] === "success"}
            setToggleState={setShowAlert}
            toggleState={showAlert}
          />
        )}
      </div>
    </>
  );
}
