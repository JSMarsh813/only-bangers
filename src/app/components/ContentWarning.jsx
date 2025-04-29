"use client";

import React, { useState, useEffect } from "react";
import GeneralButton from "./GeneralButton";
export default function ContentWarning() {
  const [contentWarningAccepted, setContentWarningAccepted] = useState(false);
  const [warningOn, setWarningOn] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        <div className=" bg-red-800  text-white border-4 border-yellow-300">
          <p className="p-2">
            <strong className="bg-yellow-300 rounded-lg p-2  text-blue-950 shadow-md shadow-black border-2 border-black">
              Caution:
            </strong>{" "}
            Although we try to limit spam by only allowing registered users to
            submit posts,{" "}
            <strong className="bg-yellow-300 rounded-sm px-2 text-blue-950">
              use your best judgment with links
            </strong>
            . If the link seems suspicious, consider scanning the url with a
            free resource such as the VirusTotal website and please flag the
            post.
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
                onClick={(e) => {
                  localStorage.setItem(
                    "content-warning-off",
                    JSON.stringify(e.target.checked),
                  );
                }}
              />{" "}
              Do not show again
            </label>
          </section>
        </div>
      )}
    </div>
  );
}
