"use client";

import React, { useState, useEffect } from "react";
import FlagButtonAndLogic from "./FlagButtonAndLogic";
import FormFlagReport from "./FormFlagReport";
import { useUser } from "../context-wrappers/UserInfo";

type FlaggingContextSectionType = {
  userIsTheCreator: boolean;
  currentTargetedId: string;
  content: PostType;
  apiflagReportSubmission: string; // "/api/flag/flag-report-submission"
  apiaddUserToFlaggedByArray: string; // "/api/flag/add-user-to-general-content-flagged-by-array"
  setMessageFromApi: React.Dispatch<React.SetStateAction<string[]>>;
};
export default function FlaggingContentSection({
  userIsTheCreator,
  currentTargetedId,
  content,
  apiflagReportSubmission,
  apiaddUserToFlaggedByArray,
  setMessageFromApi,
}: FlaggingContextSectionType) {
  //STATE FOR FLAG COUNT AND COLOR AND FORM

  const { currentUsersInfo, ...other } = useUser();
  const signedInUsersId: string = currentUsersInfo.$id || "guest";

  const [flaggedCount, setFlaggedCount] = useState<number>(
    content.flagged_by_users === undefined
      ? 0
      : content.flagged_by_users.length,
  );

  const [userHasAlreadyReportedThis, setUserHasAlreadyReportedThis] =
    useState(false);

  //flagIconClickedByNewUser:
  // the only user that can toggle the report flag because they are
  // 1. not the content's creator
  // 2. haven't successfully submitted a report
  const [flagIconClickedByNewUser, setFlagIconClickedByNewUser] =
    useState(false);

  const [flagFormIsToggled, setFlagFormIsToggled] = useState(false);

  //useEffect was needed for the flag to get the correct color (red). When:

  // content.flagged_by_users  ? content.flagged_by_users.includes
  // (signedInUsersId): false;

  // was set as the default useEffect value it was showing as false
  // it needed more time to properly examine the code, so a useEffect was needed

  useEffect(() => {
    async function intialReportState() {
      const result = content.flagged_by_users
        ? content.flagged_by_users.includes(signedInUsersId)
        : false;
      setUserHasAlreadyReportedThis(result);
      setFlagIconClickedByNewUser(result);
    }
    intialReportState();
  }, [(content.flagged_by_users, signedInUsersId)]);

  // let copyOfContentForReport = [
  //   content.resource_url,
  //   content.summary,
  //   content.quote,
  // ];

  return (
    <>
      {/* <div classcontent=" bg-violet-900"> */}
      <FlagButtonAndLogic
        userHasAlreadyReportedThis={userHasAlreadyReportedThis}
        userIsTheCreator={userIsTheCreator}
        FlagIconStyling="text-xl my-auto mx-auto "
        FlagIconTextStyling="ml-2 inline-block"
        setFlagFormIsToggled={setFlagFormIsToggled}
        flagFormIsToggled={flagFormIsToggled}
        flaggedCount={flaggedCount}
        setFlaggedCount={setFlaggedCount}
        flagIconClickedByNewUser={flagIconClickedByNewUser}
        setFlagIconClickedByNewUser={setFlagIconClickedByNewUser}
      />

      {!userHasAlreadyReportedThis && flagFormIsToggled && (
        <FormFlagReport
          contentInfo={content}
          flaggedByUser={signedInUsersId}
          setFlagFormIsToggled={setFlagFormIsToggled}
          flagFormIsToggled={flagFormIsToggled}
          setFlaggedCount={setFlaggedCount}
          flaggedCount={flaggedCount}
          apiflagReportSubmission={apiflagReportSubmission}
          setFlagIconClickedByNewUser={setFlagIconClickedByNewUser}
          apiaddUserToFlaggedByArray={apiaddUserToFlaggedByArray}
          setUserHasAlreadyReportedThis={setUserHasAlreadyReportedThis}
          setMessageFromApi={setMessageFromApi}
        />
      )}
    </>
  );
}
