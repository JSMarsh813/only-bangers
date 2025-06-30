import React from "react";

type DashboardPostsStatsSectionTypes = {
  title: string;
  likedCount: number | { error: boolean; message: string };
  submittedCount: number | { error: boolean; message: string };
};
//message would be "an error occured"

export default function DashboardPostsStatsSection({
  title,
  likedCount = 0,
  submittedCount = 0,
}: DashboardPostsStatsSectionTypes) {
  return (
    <section className="">
      <h6 className="text-lg font-semibold"> {title}: </h6>
      <span className="font-normal">
        Liked:
        {typeof likedCount === "number" ? likedCount : likedCount.message}
      </span>

      <span className="block font-normal">
        Submitted:
        {typeof submittedCount === "number"
          ? submittedCount
          : submittedCount.message}
      </span>
    </section>
  );
}
