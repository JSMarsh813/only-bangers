"use server";

import axios from "axios";
import { Suspense } from "react";
import header from "../../public/space.jpg";

import Image from "next/image";
import conf from "@/config/envConfig";
import MediaObjectLeft from "./components/MediaObjectLeft";
import WideDivider from "./components/WideDivider";

export default async function Home() {
  return (
    <div className="bg-blue-800 min-h-screen text-white">
      <main className="text-center">
        <div className=" h-64 w-full relative ">
          <Image
            src={header}
            alt=""
            sizes="100vw"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <h1 className="absolute text-white text-3xl inset-0 top-[10%] font-extrabold">
            Only Bangers
          </h1>
          <p className="absolute text-white text-md md:text-xl  inset-0  top-[40%] font-extrabold">
            An app to easily filter through software developer resources so you
            can find the 'banger' resources you need!
          </p>
        </div>

        <WideDivider heading="About Only Bangers" />
        <section className="max-w-[1000px] mx-auto px-4">
          <p>
            Only bangers is a community powered database of "banger" resources
            to help you improve your technical career! Gone are the days of
            useful resources grabbing dust because it got lost in long and
            cluttered bookmark list or buried in a discord thread.
          </p>
          <p>
            Each resource has tags, so you can use the sidebar to easily filter
            the list to the resources you actually need.
          </p>

          <p>Currently there are 4 topics to choose from</p>
          <div className="w-fit mx-auto">
            <ul className="text-base md:text-lg text-white pb-8 pl-6 text-left list-disc">
              <li>General Resources </li>
              <li>Ai Resources</li>
              <li>Technical Resources</li>
              <li>Community Directory </li>
            </ul>
          </div>
        </section>
        <section>
          <WideDivider heading="Find General Resources" />
          <MediaObjectLeft
            image="/space.jpg"
            introduction="These will have non-technical resources. Topics include:"
            listOfText={[
              "Job hunting",
              "Resume",
              "Networking",
              "Improving logical skills, for example with DSA or coding challenges",
              "Managing blockers like imposter syndrome",
              "Productivity",
              "How to optimally use various websites and social media for a software developer career",
              "Freelancing",
              "Tips that are aimed at a specific background, like teaching",
            ]}
            buttonTextLeft="General Resources"
            buttonTextLeftLink="/general-resources"
            alttext="alt text"
            imgwidth="500"
            imgheight="500"
          />
        </section>

        <section>
          <WideDivider heading="Find AI Resources" />
          <button> Future Button </button>
        </section>

        <section>
          <WideDivider heading="Find Technical Resources" />
          <button> Future Button </button>
        </section>

        <section>
          <WideDivider heading="Find A Community" />
          <p>
            {" "}
            Filter through a list of various developer communities to find your
            people
          </p>
          <ul>
            <li> Discords</li>
            <li> Slacks</li>
            <li> Meetups </li>
          </ul>
          <button> Future Button </button>
        </section>

        <section>
          <WideDivider heading="Create A Free Account!" />
          <p>
            All posts are viewable publically, but by creating a free account
            you'll unlock these time-saving features:
          </p>
          <ul>
            <li>Ability to like posts</li>
            <li>View your liked posts </li>
            <li>View your submitted posts</li>
            <li>
              Your personalized list of saved post or created post has a
              filtering sidebar available, so you can quickly find the resource
              you're looking for
            </li>
            <li>Ability to submit content </li>
            <li>Ability to flag posts for content or suggest edits </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
