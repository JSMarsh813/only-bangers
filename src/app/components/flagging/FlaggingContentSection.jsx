import React, { useState, useEffect } from "react";
import FlagButtonAndLogic from "./FlagButtonAndLogic";
// import FormFlagReport from "./FormFlagReport";
import GeneralButton from "../GeneralButton";
import FormFlagReport from "./FormFlagReport";

export default function FlaggingContentSection({
  userIsTheCreator,
  signedInUsersId,
  currentTargetedId,
  content,
  apiflagReportSubmission,
  apiaddUserToFlaggedByArray,
}) {
  //STATE FOR FLAG COUNT AND COLOR AND FORM

  const [flaggedCount, setFlaggedCount] = useState(
    content.flaggedby === undefined ? 0 : content.flaggedby.length,
  );

  const [userHasAlreadyReportedThis, setUserHasAlreadyReportedThis] = useState(
    content.flaggedby != null
      ? content.flaggedby.includes(signedInUsersId)
      : false,
  );

  //flagIconClickedByNewUser:
  // the only user that can toggle the report flag because they are
  // 1. not the content's creator
  // 2. haven't successfully submitted a report
  const [flagIconClickedByNewUser, setFlagIconClickedByNewUser] = useState(
    userHasAlreadyReportedThis,
  );

  const [flagFormIsToggled, setFlagFormIsToggled] = useState(false);

  // let copyOfContentForReport = [
  //   content.resource_url,
  //   content.summary,
  //   content.quote,
  // ];

  return (
    <>
      {/* <div classcontent=" bg-violet-900"> */}
      <FlagButtonAndLogic
        data={content}
        FlagIconStyling="text-xl my-auto mx-auto "
        FlagIconTextStyling="ml-2 inline-block"
        currentTargetedId={currentTargetedId}
        signedInUsersId={signedInUsersId}
        flagFormIsToggled={flagFormIsToggled}
        setFlagFormIsToggled={setFlagFormIsToggled}
        flaggedCount={flaggedCount}
        setFlaggedCount={setFlaggedCount}
        flagIconClickedByNewUser={flagIconClickedByNewUser}
        setFlagIconClickedByNewUser={setFlagIconClickedByNewUser}
        userHasAlreadyReportedThis={userHasAlreadyReportedThis}
        userIsTheCreator={userIsTheCreator}
      />
      {/* </div> */}
      {/* !userIsTheCreator && */}
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
        />
      )}
    </>
  );
}
