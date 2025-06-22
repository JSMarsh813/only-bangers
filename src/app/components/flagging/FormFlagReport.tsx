import React, { FormEvent, useState } from "react";
import GeneralButton from "../GeneralButton";
import axios from "axios";
import CheckboxWithLabelAndDescription from "../CheckBoxWithLabelAndDescription";
import { Field } from "@headlessui/react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

type AddFlagReportType = {
  flaggedByUser: string;
  contentInfo: PostType; //post from IndividualPost
  apiflagReportSubmission: string; // "/api/flag/flag-report-submission"
  apiaddUserToFlaggedByArray: string; // "/api/flag/add-user-to-general-content-flagged-by-array"
  flagFormIsToggled: boolean;

  setFlagFormIsToggled: React.Dispatch<React.SetStateAction<boolean>>;

  setFlaggedCount: React.Dispatch<React.SetStateAction<number>>;
  flaggedCount: number;

  setFlagIconClickedByNewUser: (value: React.SetStateAction<boolean>) => void;

  setUserHasAlreadyReportedThis: (value: React.SetStateAction<boolean>) => void;

  setMessageFromApi: React.Dispatch<React.SetStateAction<string[]>>;
};

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
}: AddFlagReportType) {
  const [description, setDescription] = useState("");
  const [flagCategoriesState, setFlagCategoriesState] = useState<string[]>([]);
  //flagCategoriesState is an array of strings
  //flagCategoriesState is initialized as an empty array
  const [additionalCommentsState, setAdditionalCommentsState] = useState("");

  const copyOfContentForReport = [
    contentInfo.resource_url,
    contentInfo.summary,
    contentInfo.quote,
  ];

  console.log(contentInfo);

  const handleFlagCategoriesState = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value, checked } = e.target;
    //value examples:
    // "Add flags for controversial or vulgar content"
    //" Typos or wrong tag"
    if (checked) {
      setFlagCategoriesState([...flagCategoriesState, value]);
    } else {
      setFlagCategoriesState(
        flagCategoriesState.filter((flagTitle) => flagTitle != value),
      );
    }
  };

  const handleSubmitReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (flagCategoriesState.length === 0) {
      setMessageFromApi([
        "error, You must click 1 or more of the checkboxes for flag type",
        "error",
      ]);
      console.log(
        "error, You must click 1 or more of the checkboxes for flag type",
      );

      return;
    }
    if (flaggedByUser == "") {
      setMessageFromApi(["you must be signed in to flag content", "error"]);
      console.log("you must be signed in to flag content");
      return;
    }

    const contentCreatedByUserId =
      contentInfo.shared_by_user.$id !== undefined
        ? contentInfo.shared_by_user.$id
        : null;

    if (contentCreatedByUserId === flaggedByUser) {
      console.log("user is flagging their own content");
      setMessageFromApi([
        "Nice try but you can't flag your own content 😉",
        "error",
      ]);

      return;
    }

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
      const reportFromApi = await axios.post(
        apiflagReportSubmission,
        reportSubmission,
      );

      const addUserToArray = await axios.put(
        apiaddUserToFlaggedByArray,
        userAndNameId,
      );

      setUserHasAlreadyReportedThis(true);
      setMessageFromApi(["report submitted!", "success"]);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        //axios.isAxiosError(error) is a typeguard, so typescript knows this is an axios error type

        // you need the && error.response to access error.response with typescript
        // Why? Even if axios.isAxiosError(error) is true, error.response might still be undefined, so most be checked or you'll get this typescript errors "'error.response' is possibly 'undefined'.ts(18048)"

        //error.response would happen if there was a network error (aka no internet). error.response confirms a response was actually received (not a network error)

        if (error.message && error.config) {
          setMessageFromApi([
            `${error.response.statusText} on path ${error.config.url}`,
            "error",
          ]);
        } else {
          setMessageFromApi([
            error.response.statusText,
            "an unexpected error occursed",
          ]);
        }
      } else {
        // to handle non-Axios errors or cases where response is undefined
        console.error("An unexpected error occurred:", error);
      }
      setFlagFormIsToggled(false);
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
          <form
            className=" mx-auto bg-blue-900 rounded-lg w-[94vw] px-4"
            onSubmit={handleSubmitReport}
          >
            <div className="flex items-center justify-center py-6   bg-darkPurple">
              <GeneralButton
                text="Cancel"
                type="button"
                className="mx-2  warning"
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
                  <h3 className=" mb-2 text-xl mx-auto py-3">Comments</h3>
                </div>
                <Field className="border-t-2 border-white py-2">
                  <textarea
                    aria-label="type-comments"
                    onChange={(e) => setAdditionalCommentsState(e.target.value)}
                    className="bg-violet-100 rounded border  border-gray-400 leading-normal text-black w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white mt-2"
                    name="body"
                    maxLength={500}
                  ></textarea>
                </Field>
                <span className="text-white">
                  {`${500 - description.length}/500 characters left`}
                </span>

                <Field>
                  <div className="flex justify-center gap-20">
                    <GeneralButton
                      text="Cancel"
                      type="button"
                      className="mx-2  warning"
                      onClick={() => cancelFlagFormAndRevertFlagState()}
                    />
                    <GeneralButton
                      type="submit"
                      className="bg-yellow-300 text-blue-800 py-1 px-4 border border-yellow-600 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                      text="Submit Report"
                    />
                  </div>
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
