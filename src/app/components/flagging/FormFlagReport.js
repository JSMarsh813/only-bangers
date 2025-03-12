import React, { useState } from "react";
import GeneralButton from "../GeneralButton";
// import { toast } from "react-toastify";
import axios from "axios";
import CheckboxWithLabelAndDescription from "../CheckBoxWithLabelAndDescription";
import { Field } from "@headlessui/react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

function AddFlagReport({
  flaggedByUser,
  contentInfo,
  apiflagReportSubmission,
  apiaddUserToFlaggedByArray,
  flagFormIsToggled,
  setFlagFormIsToggled,
  setFlaggedCount,
  flaggedCount,
  setFlagIconClickedByNewUser,
  setUserHasAlreadyReportedThis,
  setMessageFromApi,
}) {
  const [description, setDescription] = useState("");
  const [flagCategoriesState, setFlagCategoriesState] = useState([]);
  const [additionalCommentsState, setAdditionalCommentsState] = useState("");

  let copyOfContentForReport = [
    contentInfo.resource_url,
    contentInfo.summary,
    contentInfo.quote,
  ];

  console.log(contentInfo);

  const handleFlagCategoriesState = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFlagCategoriesState([...flagCategoriesState, value]);
    } else {
      setFlagCategoriesState(
        flagCategoriesState.filter((flagTitle) => flagTitle != value),
      );
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();

    if (flagCategoriesState.length === 0) {
      setMessageFromApi(
        "error, You must click 1 or more of the checkboxes for flag type",
      );
      console.log(
        "error, You must click 1 or more of the checkboxes for flag type",
      );

      return;
    }
    if (flaggedByUser == "") {
      setMessageFromApi("you must be signed in to flag content");
      console.log("you must be signed in to flag content");
      return;
    }

    let contentCreatedByUserId =
      contentInfo.shared_by_user.$id !== undefined
        ? contentInfo.shared_by_user.$id
        : null;

    // if (contentCreatedByUserId === flaggedByUser) {
    //   console.log("user is flagging their own content");
    //setMessageFromApi("Nice try but you can't flag your own content 😉");
    //You must click 1 or more of the checkboxes for flag type`,
    //   return;
    // }

    const reportSubmission = {
      created_by_user: contentCreatedByUserId,
      flagged_by_user: flaggedByUser,
      flag_categories: flagCategoriesState,
      comments: additionalCommentsState,
      content_id: contentInfo.$id,
      content_copy: copyOfContentForReport,
    };

    const userAndNameId = {
      contentid: contentInfo.$id,
      flaggedbyuser: flaggedByUser,
    };

    try {
      let reportFromApi = await axios.post(
        apiflagReportSubmission,
        reportSubmission,
      );
      setMessageFromApi(`${JSON.stringify(reportFromApi)}`);
      let addUserToArray = await axios.put(
        apiaddUserToFlaggedByArray,
        userAndNameId,
      );
      setMessageFromApi(`${JSON.stringify(addUserToArray)}`);

      await setUserHasAlreadyReportedThis(true);
      await setMessageFromApi("report submitted!");
    } catch (error) {
      setMessageFromApi("error");

      if (error.message && error.config) {
        setMessageFromApi(
          `${error.response.statusText} on path ${error.config.url}`,
        );
      } else {
        setMessageFromApi(error.response.statusText);
      }

      await setFlagFormIsToggled(false);
    }
  };

  function cancelFlagFormAndRevertFlagState() {
    setFlagIconClickedByNewUser(false);
    setFlagFormIsToggled(!flagFormIsToggled);
    setFlaggedCount((flaggedCount -= 1));
  }

  return (
    <Dialog
      open={flagFormIsToggled}
      onClose={() => setFlagFormIsToggled(false)}
      className="relative z-50 "
    >
      <div
        className="fixed inset-0 flex w-screen overflow-scroll justify-center"
        tabIndex={1}
      >
        <DialogPanel className=" bg-black p-12 bg-opacity-80 h-fit w-screen">
          <form className=" mx-auto bg-blue-900 rounded-lg w-[94vw] px-4">
            <div className="flex items-center justify-center py-6   bg-darkPurple">
              <GeneralButton
                text="Cancel"
                className="mx-2  text-blue-800 bg-yellow-300 border-b-yellow-600"
                onClick={() => cancelFlagFormAndRevertFlagState()}
              />
            </div>

            <div className={`-mx-3 mb-6`}>
              {/* Area to Type a comment  */}

              <div className=" mb-2 text-white px-4 pt-2">
                <h2 className="text-center text-xl ">
                  Report for Suggestions or Flagging Content
                </h2>
                <p className="text-center mt-3">
                  Thank you for taking the time to help us improve our community
                  powered database! 🙏🙇
                </p>
                <p className="text-center ">
                  We could not make make this site the best resource possible
                  without you.
                </p>

                <p className="text-center mb-3">
                  ❗ Note:{" "}
                  <strong> one or more checkboxes must be selected</strong> to
                  submit this form
                </p>

                <div className=" bg-darkPurple border-white border-2 flex">
                  <h3 className=" mb-2 text-xl mx-auto py-3">
                    {" "}
                    Suggest Changes{" "}
                  </h3>
                </div>
                <CheckboxWithLabelAndDescription
                  handleFlagCategoriesState={handleFlagCategoriesState}
                  title="Add flags for controversial or vulgar content"
                  description="For content that isn't hate speech or gratious violence but could still be considered edgy. This allows users to opt in or out of seeing this content."
                />

                <CheckboxWithLabelAndDescription
                  handleFlagCategoriesState={handleFlagCategoriesState}
                  title="Add other tags"
                  description="Please write the suggested tags in the textbox below. Thank you!"
                />

                <CheckboxWithLabelAndDescription
                  handleFlagCategoriesState={handleFlagCategoriesState}
                  title="Typos or wrong tags"
                  description="Please describe the typos or incorrect tags in the textbox below. Thank you!"
                />

                <div className=" bg-darkPurple border-white border-2 flex">
                  <h3 className=" mb-2 text-xl mx-auto py-3">
                    Flag Inappropriate Content
                  </h3>
                </div>

                <CheckboxWithLabelAndDescription
                  handleFlagCategoriesState={handleFlagCategoriesState}
                  title="Hate"
                  description="Slurs, racist or sexist stereotypes, Incitement of fear or discrimination, Violent 	extremism and terrorism, hate groups & networks"
                />
                <CheckboxWithLabelAndDescription
                  handleFlagCategoriesState={handleFlagCategoriesState}
                  title="Violent Speech"
                  description="Violent Threats, Wish of Harm, Coded Incitement of Violence"
                />
                <CheckboxWithLabelAndDescription
                  handleFlagCategoriesState={handleFlagCategoriesState}
                  title="Abuse and Harassment"
                  description="Insults, unwanted advances, targeted harassment and inciting harassment"
                />
                <CheckboxWithLabelAndDescription
                  handleFlagCategoriesState={handleFlagCategoriesState}
                  title="Privacy"
                  description="Sharing private information of others, threatening to share or expose private information"
                />
                <CheckboxWithLabelAndDescription
                  handleFlagCategoriesState={handleFlagCategoriesState}
                  title="Spam"
                  description="Fake engagement, scams, malicious links"
                />
                <CheckboxWithLabelAndDescription
                  handleFlagCategoriesState={handleFlagCategoriesState}
                  title="Sensitive or disturbing content"
                  description="Gratuitous gore or violence, nudity & sexual behavior"
                />
                <CheckboxWithLabelAndDescription
                  handleFlagCategoriesState={handleFlagCategoriesState}
                  title="None of these"
                  description="Please give us more information in the comments textbox below"
                />

                <div className=" bg-darkPurple border-white border-2 flex">
                  <h3 className=" mb-2 text-xl mx-auto py-3">
                    Additional Comments
                  </h3>
                </div>
                <Field className="border-t-2 border-white py-2">
                  <textarea
                    aria-label="type-comments"
                    onChange={(e) => setAdditionalCommentsState(e.target.value)}
                    className="bg-violet-100 rounded border  border-gray-400 leading-normal text-black w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white mt-2"
                    name="body"
                    required
                    maxLength="500"
                    placeholder="Optional"
                  ></textarea>
                </Field>
                <span className="text-white">
                  {`${500 - description.length}/500 characters left`}
                </span>

                <Field>
                  <GeneralButton
                    type="submit"
                    className="bg-yellow-300 text-blue-800 py-1 px-4 border border-yellow-600 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                    onClick={handleSubmitReport}
                    text="Submit Report"
                  />
                </Field>
              </div>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default AddFlagReport;
