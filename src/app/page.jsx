"use server";

import axios from "axios";
import { Suspense } from "react";
import header from "../../public/space.jpg";

import Image from "next/image";
import conf from "@/config/envConfig";

export default async function Home() {
  return (
    <div className="bg-100devs min-h-screen">
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

        <h3> About Only Bangers</h3>
        <p>
          Only bangers is a community powered database of "banger" resources to
          help you improve your technical career! Gone are the days of useful
          resources grabbing dust because it got lost in long and cluttered
          bookmark list or buried in a discord thread.
        </p>
        <p>
          Each resource has tags, so you can use the sidebar to easily filter
          the list to the resources you actually need.
        </p>

        <p>Currently there are 4 topics to choose from</p>
        <ul>
          <li>General Resources </li>
          <li>Ai Resources</li>
          <li>Technical Resources</li>
          <li>Community Directory </li>
        </ul>

        <section>
          <h4> Find General Resources</h4>
          <p>These will have non-technical resources. For example:</p>
          <ul>
            <li> Job hunting and resume</li>
            <li> Networking </li>
            <li>
              {" "}
              Improving general logical skills, for example with DSA or coding
              challenges{" "}
            </li>
            <li> Managing blockers like imposter syndrome</li>
            <li> Productivity</li>
            <li>
              {" "}
              How to optimally use various websites and social media for a
              software dev career
            </li>
            <li> Freelancing </li>
            <li>
              {" "}
              Tips that are aimed at a specific background, like teaching
            </li>
          </ul>
          <button> Future Button </button>
        </section>

        <section>
          <h4> Find Ai Resources</h4>
          <button> Future Button </button>
        </section>

        <section>
          <h4> Find Technical Resources</h4>
          <button> Future Button </button>
        </section>

        <section>
          <h4> Find A Community</h4>
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
          <h4> Create A Free Account</h4>
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
