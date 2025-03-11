"use client";

import React from "react";
import { useState } from "react";
import NewPostForm from "./form/NewPostForm";
import GeneralButton from "./GeneralButton";
import { Dialog, DialogPanel } from "@headlessui/react";

export default function SectionForNewFormButtonAndForm({ tags }) {
  const [newContentFormShowing, setNewContentFormShowing] = useState(false);
  const [statusOfSubmission, setStatusOfSubmission] = useState(true);

  return (
    <div className=" bg-blue-900 pb-8">
      <GeneralButton
        text="Submit New Content"
        className="mx-auto bg-yellow-200 text-100devs border-yellow-600"
        onClick={() => setNewContentFormShowing(!newContentFormShowing)}
        type="button"
      />
      {statusOfSubmission === true && (
        <p className="text-white bg-green-600 p-2 inline-block">
          Submission successful!{" "}
          <GeneralButton
            text="close"
            className="bg-100devs text-white inline-block ml-2"
          />
        </p>
      )}

      {newContentFormShowing && (
        <Dialog
          open={newContentFormShowing}
          onClose={() => setNewContentFormShowing(false)}
          className="relative z-50 "
        >
          <div
            className="fixed inset-0 flex w-screen overflow-scroll justify-center"
            tabIndex={1}
          >
            <DialogPanel className=" bg-black p-12 bg-opacity-80 h-fit">
              <NewPostForm
                tagList={tags}
                setNewContentFormShowing={setNewContentFormShowing}
                newContentFormShowing={newContentFormShowing}
                setStatusOfSubmission={setStatusOfSubmission}
              />
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
