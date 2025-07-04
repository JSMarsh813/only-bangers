import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { deletePost } from "../../../server-actions/postActions";
import LoadingSpinner from "../LoadingSpinner";
// import { toast, ToastContainer } from "react-toastify";

type DeleteContentNotificationTypes = {
  setShowDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>;

  contentId: string;
  signedInUsersId: string;
  contentCreatedBy: string;
  postsSwrPageProperty: number | undefined;

  setMessageFromApi: React.Dispatch<React.SetStateAction<string[]>>;

  setDeleteThisContentId: React.Dispatch<React.SetStateAction<string | null>>;

  setChangedItemsSwrPage: React.Dispatch<
    React.SetStateAction<number | null | undefined>
  >;
};
export default function DeleteContentNotification({
  setShowDeleteConfirmation,
  contentId,
  signedInUsersId,
  contentCreatedBy,
  setMessageFromApi,
  setDeleteThisContentId,
  setChangedItemsSwrPage,
  postsSwrPageProperty,
}: DeleteContentNotificationTypes) {
  //  toast.success(`You successfully deleted your post!`)

  const [processingDeletionRequest, setProcessingDeletionRequest] =
    useState(false);

  const handleContentDelete = async (postId: string) => {
    if (signedInUsersId != contentCreatedBy) {
      //   toast.error(
      //     "validation error, session id does not match the post creator's id",
      //   );
      console.log("not signed in");
      return;
    } else {
      try {
        setProcessingDeletionRequest(true);
        await deletePost(postId);
        setMessageFromApi(["This post was successfully deleted!", "success"]);
        setChangedItemsSwrPage(postsSwrPageProperty);
        setShowDeleteConfirmation(false);
        // console.log(`this is content id to delete ${contentId}`);
        setDeleteThisContentId(contentId);
      } catch (error) {
        console.log("there was an error when deleting your content", error);
        setProcessingDeletionRequest(false);
        setMessageFromApi([
          "there was an error when deleting your content",
          "error",
        ]);
        setShowDeleteConfirmation(false);
      }
    }
  };

  return (
    <div>
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          {/* centers content */}
          <div
            className="            
                p-4 text-center sm:items-center sm:p-0 
                max-w-3xl
                mx-auto my-2"
          >
            <div>
              <div className="">
                <div
                  className="mx-auto flex flex-col font-semibold text-darkPurple bg-blue-900
                     border-2 border-violet-400 border-dotted 
                     p-4 shadow-lg max-w-3xl"
                >
                  <div className="relative p-4 text-center rounded-lg s sm:p-5">
                    <button
                      className="absolute right-0"
                      onClick={() => setShowDeleteConfirmation(false)}
                    >
                      <FontAwesomeIcon
                        icon={faX}
                        className="text-xl text-rose-500"
                      />
                    </button>

                    <svg
                      className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                      aria-hidden="true"
                      fill="white"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>

                    <p className="mb-4 text-gray-500 dark:text-gray-300">
                      Are you sure you want to delete this?
                    </p>

                    {!processingDeletionRequest && (
                      <div
                        className={`flex justify-center items-center space-x-4 `}
                      >
                        <button
                          data-modal-toggle="deleteModal"
                          type="button"
                          className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 
                
                hover:bg-gray-100 hover:text-gray-900 
                
                focus:ring-4 focus:outline-none focus:ring-primary-300 focus:z-10 
                
                dark:bg-black dark:text-gray-300 dark:border-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600
                "
                          onClick={() => setShowDeleteConfirmation(false)}
                        >
                          No, cancel
                        </button>

                        <button
                          type="submit"
                          className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                          onClick={() => handleContentDelete(contentId)}
                        >
                          Yes, I&apos;m sure
                        </button>
                      </div>
                    )}
                    {processingDeletionRequest && (
                      <div className="flex align-middle justify-center">
                        <p className="my-auto text-white">
                          Processing your deletion request
                        </p>
                        <LoadingSpinner />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
