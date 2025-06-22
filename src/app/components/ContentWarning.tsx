"use client";

import React, { useState, useEffect } from "react";
import GeneralButton from "./GeneralButton";
export default function ContentWarning() {
  const [contentWarningAccepted, setContentWarningAccepted] = useState(false);
  const [warningOn, setWarningOn] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    //checking for if its mounted, so this element doesn't render until its had a chance to check local storage
    setMounted(true);

    //localStorage will only work in a useEffect
    //https://stackoverflow.com/questions/76300847/getting-referenceerror-localstorage-is-not-defined-even-after-adding-use-clien
    const warningNotifOff =
      localStorage.getItem("content-warning-off") === "true";
    if (warningNotifOff) {
      setWarningOn(false);
    }
  }, []);
  //can't conditionally render this component based on localStorage through the parent, since the parent is a server component, so it can't access localStorage

  return (
    <div>
      {mounted && warningOn && (
        <div className=" bg-red-900  text-white border-4 border-yellow-200">
          <p className="p-2">
            <strong className="bg-yellow-300 rounded-lg px-4  text-blue-950 shadow-md shadow-black border-2 border-black">
              Caution
            </strong>{" "}
            Although we limit spam by only allowing registered users to submit
            posts,{" "}
            <strong className=" rounded-sm ">
              use your best judgment with links.
            </strong>
          </p>
          <p className="p-2">
            If the link seems suspicious, consider scanning the url with a free
            resource such as the VirusTotal website and please flag the post.
          </p>
          <section className="flex gap-2  justify-center">
            <label
              htmlFor="content-warning-agree"
              className="my-auto font-bold"
            >
              <input
                type="checkbox"
                id="content-warning-agree"
                name="content-warning-agree"
                value="I understand"
                onChange={(e) => {
                  setContentWarningAccepted(e.target.checked);
                }}
              />{" "}
              I understand the risks{" "}
            </label>

            <GeneralButton
              className="bg-yellow-300 text-blue-950"
              text="Close"
              disabled={!contentWarningAccepted}
              type="button"
              onClick={() => {
                setWarningOn(false);
              }}
            />
            <label
              htmlFor="content-warning-off"
              className="my-auto"
            >
              <input
                type="checkbox"
                id="content-warning-off"
                name="content-warning-off"
                value="I understand"
                disabled={!contentWarningAccepted}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  localStorage.setItem(
                    "content-warning-off",
                    JSON.stringify(e.target.checked),
                  );
                }}
              />{" "}
              {
                /* //checkboxes should use onChange not onClick, which has

              // if onClick had been used:
              // e.target would have the type EventTarget which doesn't have the checked property
              // so type Assertion, aka "e.target as HTMLInputElement"would of been necessary, since HTMLInputElement has the checked property */
                // why does onChange have the checked property and onClick does not?
                //               onChange for a checkbox/input is specifically typed to React.ChangeEvent<HTMLInputElement>, which knows about properties like .checked.
                // onClick is typed as React.MouseEvent<HTMLElement>, and its .target is a general EventTarget, which doesn’t have .checked.
                // onClick is meant for any HTML element — buttons, divs, spans, etc. — so its typing is more generic.
                // onChange is meant for form elements, so it’s more specialized, especially for input, textarea, select.
              }
              Do not show again
            </label>
          </section>
        </div>
      )}
    </div>
  );
}
