import React from "react";

export default function DashboardPostsStatsSection({
  title,
  likedCount = 0,
  submittedCount = 0,
}) {
  return (
    <section className="">
      <h6 className="text-lg font-semibold"> {title}: </h6>
      <span className="font-normal">Liked: {likedCount || 0}</span>
      <span className="block font-normal">
        Submitted: {submittedCount || 0}
      </span>
    </section>
  );
}
