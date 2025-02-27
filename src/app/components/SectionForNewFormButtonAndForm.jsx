"use client";

import React from "react";
import { useState } from "react";
import NewPostForm from "./form/NewPostForm";
import GeneralButton from "./GeneralButton";
import { Dialog, DialogPanel } from "@headlessui/react";

export default function SectionForNewFormButtonAndForm({ tags }) {
  const [newContentFormShowing, setNewContentFormShowing] = useState(false);

  return (
    <div className=" bg-blue-900">
      <GeneralButton
        text="Submit New Content"
        className="mx-auto"
        onClick={() => setNewContentFormShowing(!newContentFormShowing)}
        type="button"
      />

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
              />
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
