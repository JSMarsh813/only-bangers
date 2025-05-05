import React from "react";
import GeneralButton from "./GeneralButton";
import { useSWRConfig } from "swr";
import WarningNotice from "./WarningNotice";

export default function CheckForMoreDataButton({
  currentlyClickedPage,
  filteredListLastPage,
  setCheckingForNewestDataFunction,
  checkingForNewestData,
}) {
  return (
    <div>
      {currentlyClickedPage >= filteredListLastPage && (
        <div className="text-center my-4">
          <p className="text-white">
            You have reached the end of the list! However you can click &quot;
            check for more &quot; again to check for posts that were just added.
          </p>

          {checkingForNewestData && (
            <WarningNotice
              className="w-fit "
              text="You can check again in 1 minute"
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
