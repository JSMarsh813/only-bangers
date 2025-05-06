import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import DeleteContentNotification from "./DeleteContentNotification";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

// import DeleteContentNotification from "./DeleteContentNotification";
import GeneralButton from "../GeneralButton";
export default function DeleteButton({
  signedInUsersId,
  contentId,
  contentCreatedBy,

  setMessageFromApi,
  setDeleteThisContentId,
  postsSwrPageProperty,
}) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  function updateDeleteState() {
    setShowDeleteConfirmation(true);
  }

  return (
    <>
      <GeneralButton
        text="Delete"
        className="bg-red-700"
        onClick={updateDeleteState}
        type="button"
        fontAwesome={faTrashCan}
      />

      {showDeleteConfirmation && (
        <Dialog
          open={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          className="relative z-50 "
        >
          <div
            className="fixed inset-0 flex w-screen overflow-scroll justify-center"
            tabIndex={1}
          >
            <DialogPanel className=" bg-darkPurple p-12 bg-opacity-80 h-fit">
              <DeleteContentNotification
                setShowDeleteConfirmation={setShowDeleteConfirmation}
                contentId={contentId}
                signedInUsersId={signedInUsersId}
                contentCreatedBy={contentCreatedBy}
                setMessageFromApi={setMessageFromApi}
                setDeleteThisContentId={setDeleteThisContentId}
                setChangedItemsSwrPageFunction={setChangedItemsSwrPageFunction}
                postsSwrPageProperty={postsSwrPageProperty}
              />
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </>
  );
}
