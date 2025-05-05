import React from "react";
import GeneralButton from "./GeneralButton";
import { useSWRConfig } from "swr";

export default function CheckForMoreDataButton({
  currentlyClickedPage,
  filteredListLastPage,
  setCheckingForNewestDataFunction,
}) {
  return (
    <div>
      {currentlyClickedPage >= filteredListLastPage && (
        <div className="text-center my-4">
          <p className="text-white">
            You have reached the end of the list! However you can click &quot;
            check for more &quot; again to check for posts that were just added.
          </p>
          <GeneralButton
            text="Check for more"
            className="mx-auto bg-yellow-200 border-yellow-700 text-blue-900"
            type="submit"
            onClick={() => setCheckingForNewestDataFunction()}
            // onClick={() => setSizeFunction(swrCacheNumberOfPages + 1)}
          />
        </div>
      )}
    </div>
  );
}
