import React from "react";
import GeneralButton from "./GeneralButton";
import { useSWRConfig } from "swr";
import WarningNotice from "./WarningNotice";

type CheckForMoreDataButtonType = {
  currentlyClickedPage: number;
  filteredListLastPage: number;
  setCheckingForNewestDataFunction: () => void;
  //is not a setter function though it has set function inside of it
  //its an async function that does not return anything
  checkingForNewestData: boolean;
};

export default function CheckForMoreDataButton({
  currentlyClickedPage,
  filteredListLastPage,
  setCheckingForNewestDataFunction,
  checkingForNewestData,
}: CheckForMoreDataButtonType) {
  return (
    <div className="bg-blue-950">
      {currentlyClickedPage >= filteredListLastPage && (
        <div className="text-center my-4">
          <div>
            <p className="text-white pt-4 pb-2">
              You have reached the end of the most current data!
            </p>
            <p className="text-white  pb-4 ">
              However you can click &quot; check for more &quot; again to check
              for posts that were just added.
            </p>
          </div>

          {checkingForNewestData && (
            <WarningNotice
              className="w-fit "
              text="Please wait 30 seconds to check again"
            />
          )}
          <GeneralButton
            text="Check for more"
            disabled={checkingForNewestData}
            className={`mx-auto bg-yellow-200 border-yellow-700 text-blue-900 ${
              checkingForNewestData && "bg-gray-300"
            }`}
            type="submit"
            onClick={() => setCheckingForNewestDataFunction()}
            // onClick={() => setSizeFunction(swrCacheNumberOfPages + 1)}
          />
        </div>
      )}
    </div>
  );
}
