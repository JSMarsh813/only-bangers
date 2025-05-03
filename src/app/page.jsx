"use server";

import axios from "axios";
import { Suspense } from "react";
import header from "../../public/space.jpg";

import Image from "next/image";
import conf from "@/config/envConfig";
import MediaObjectLeft from "./components/MediaObjectLeft";
import MediaObjectRight from "./components/MediaObjectRight";
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
            unoptimized
          />
          <h1 className="absolute text-white text-3xl inset-0 top-[10%] font-extrabold">
            Only Bangers
          </h1>
          <p className="absolute text-white text-md md:text-xl  inset-0  top-[40%] font-extrabold">
            An app to easily find 'banger' resources to improve your technical
            career!
          </p>
        </div>

        <WideDivider heading="About Only Bangers" />
        <section className="max-w-[1000px] mx-auto px-4">
          <p className="py-4">
            Only bangers is a community powered database of "banger" resources
            to help you improve your technical career! Gone are the days of
            useful resources grabbing dust because it got lost in a list.
          </p>
          <p className="pb-4">
            Each post has tags, so you can easily "git" the resources you want
            by filtering with the sidebar 😉{" "}
          </p>

          <p className="pb-4">Currently there are 4 topics to choose from</p>
          <div className="w-fit mx-auto">
            <ul className="  text-white  px-6 text-left border-y-2 py-4 border-white mb-6">
              <li> ✅ General Resources </li>
              <li> ✅ Ai Resources (Future)</li>
              <li> ✅ Technical Resources (Future)</li>
              <li> ✅ Community Directory (Future) </li>
            </ul>
          </div>
        </section>
        <section>
          <WideDivider heading="Find General Resources" />
          <MediaObjectLeft
            image="/space.jpg"
            introduction="Resources that do not focus on a specific coding language or AI"
            listOfText={[
              "Networking",
              "Job hunting",
              "Resume",
              "Improving logical skills, for example with DSA or coding challenges",
              "Managing blockers like imposter syndrome",
              "Productivity",
              "How to optimally use various websites and social media for a technical career",
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
          <MediaObjectRight
            introduction="Tips and discussions for using AI as a technical professional"
            image="/space.jpg"
            listOfText={[
              "Generative AI",
              "Using AI when programming",
              "Using AI when job hunting",
              "Using AI for writing & presentations",
              "Using AI to study",
              "Tips to create prompts",
              "Concerns or predictions about AI",
              "Effect on the job market",
              "Experiences using AI",
              "Ethics and copyright",
              "Discussing AI Models",
            ]}
            buttonTextRight={"future"}
            buttonTextRightLink={"/ai-resources"}
            alttext={"test"}
            imgwidth="500"
            imgheight="500"
          />
        </section>

        <section>
          <WideDivider heading="Find Technical Resources" />
          <MediaObjectLeft
            image="/space.jpg"
            introduction="Tips for coding languages and frameworks. Topics include:"
            listOfText={[
              "Learning resources",
              "Discussions about a language",
              "Helpful resources to use in your project such prettier",
            ]}
            buttonTextLeft="Future"
            buttonTextLeftLink="/technical-resources"
            alttext="alt text"
            imgwidth="500"
            imgheight="500"
          />
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
