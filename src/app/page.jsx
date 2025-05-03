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
            useful resources grabbing dust because it got lost in a long list.
          </p>
          <p className="pb-4">
            Each post has tags, so you can easily "git" the resources you want
            by filtering with the sidebar 😉{" "}
          </p>

          <p className="pb-4 font-bold">
            Currently there are 4 topics to choose from
          </p>

          <ul className="mx-auto w-fit text-white  px-6 text-left border-y-2 py-4 border-white mb-6">
            <li> ✅ General Resources </li>
            <li> ✅ Ai Resources (Future)</li>
            <li> ✅ Technical Resources (Future)</li>
            <li> ✅ Community Directory (Future) </li>
          </ul>

          <h5 className="my-4 font-bold">If a resource helped you please:</h5>

          <ul className="text-left mx-auto w-fit">
            <li>✅ Comment on the original creators content to thank them</li>
            <li> ✅ Like the post to thank the person who shared the post</li>
          </ul>

          <h5 className="my-4 font-bold">
            Why do all the resources require a public link?
          </h5>
          <ul className="mb-4 text-left mx-auto w-fit">
            <li>
              ✅ Allow the original creator to control their content's
              availability
            </li>
            <li>
              ✅ Reduce the risk of private information being shared publically
            </li>
          </ul>
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

          <MediaObjectRight
            introduction="  Filter through a list of various developer communities to find your
            people 👋"
            image="/space.jpg"
            listOfText={[
              "Discords",
              "Slacks",
              "Meetups",
              "Groups for specific technology",
              "Groups focused on minority groups",
            ]}
            buttonTextRight={"future"}
            buttonTextRightLink={"/community-resources"}
            alttext={"test"}
            imgwidth="500"
            imgheight="500"
          />
        </section>

        <section>
          <WideDivider heading="Create A Free Account" />

          <MediaObjectLeft
            introduction="  All posts are viewable publically, but by creating a free account
            you'll unlock these time-saving features:"
            image="/space.jpg"
            listOfText={[
              "Ability to like posts",
              "View your liked posts",
              "View your submitted posts",
              "Your personalized list of saved post or created posts has a filtering sidebar available, so you can quickly find the resource             you're looking for",
              "Ability to submit content",
              "Ability to flag posts for content or suggest edits ",
            ]}
            buttonTextLeft={"Create Account"}
            buttonTextLeftLink={"/signup"}
            alttext={"test"}
            imgwidth="500"
            imgheight="500"
          />
          <p></p>
        </section>
      </main>
    </div>
  );
}
