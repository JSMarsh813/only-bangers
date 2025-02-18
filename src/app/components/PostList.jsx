"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { deletePost } from "../actions/postActions";
import ParagraphRenderBasedOnArrayProperty from "./ParagraphRenderBasedOnArrayProperty";
import GeneralButton from "./GeneralButton";
import ShowTime from "./ShowTime";
import FilteringSidebar from "./FilteringSidebar";

import IndividualPost from "./IndividualPost";

//<Post[]>'s type is written out in src/types.d.ts
export default function PostList({ initialPosts, categoriesAndTags }) {
  //initialPosts is a list of post objects
  const [posts, setPosts] = useState([...initialPosts]);
  const [tagFilters, setFiltersState] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterIsOpen, SetFilterIsOpen] = useState(false);
  console.log(JSON.stringify(posts));
  //setPosts grabs the initialPosts prop and says hey, this is list of posts is my starting state

  //adding or removing filters that we're looking for
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    checked
      ? setFiltersState([...tagFilters, value])
      : setFiltersState(tagFilters.filter((tag) => tag != value));
  };

  // filtering posts based on those tags, will we run every time new data comes in or the filtered tags list is changed

  //problem child area

  function doesPostHaveAllTheTags(currenttags, post) {
    let {} = post;
    return currenttags.every((tag) => singlePostsTagArray.includes(tag));
  }

  let arrayOfPostsWithJustTagNames = function (list) {
    return list.map((post) =>
      post.tags.reduce((accumulator, item) => {
        accumulator.push(item.tag_name);
        return accumulator;
      }, []),
    );
  };
  // RETURNS
  // [
  //   [ 'service_or_retail' ],
  //   [ 'service_or_retail', 'trades', 'networking' ],
  //   []
  // ]

  console.log(arrayOfPostsWithJustTagNames(posts));
  useEffect(() => {
    let currenttags = tagFilters;

    setFilteredPosts(
      posts.filter(
        (object) =>
          // we are filtering based on the tags, every tag needs to return yes, I am inside this objects tags
          // so currenttags goes first
          currenttags.every((tag) =>
            object.tags.map((tag) => tag.tag_name).includes(tag),
          ),
        // then we need to trim the object down to just tag names
        // filter is iterating over every object
        //object.tags trim each object so they just have their tags property
        // use map to then trim each tags so it just has the tag_names property
        //
      ),
    );
  }, [tagFilters, posts]);
  // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time tagFilters is changed

  // let PostsReducedToTagData = posts.map((post, index) => {
  //   return [].concat(post.tags);
  // [
  // {"tag_name":"service-or-retail","$id":"67b23ddf000e2a1e5017","$createdAt":"2025-02-16T19:34:52.918+00:00","$updatedAt":"2025-02-16T19:53:53.644+00:00","$permissions":[],"$databaseId":"67b10c21001fa74929be","$collectionId":"67b10d930003325b94f0"},
  // {"tag_name":"trades","$id":"67b23e25000b2157cefd","$createdAt":"2025-02-16T19:36:02.893+00:00","$updatedAt":"2025-02-16T19:53:53.729+00:00","$permissions":[],"$databaseId":"67b10c21001fa74929be","$collectionId":"67b10d930003325b94f0"},
  // {"tag_name":"networking","$id":"67b23e470005b51b59d6","$createdAt":"2025-02-16T19:36:36.784+00:00","$updatedAt":"2025-02-16T20:37:33.762+00:00","$permissions":[],"$databaseId":"67b10c21001fa74929be","$collectionId":"67b10d930003325b94f0"}
  //]

  // return { ...element.tags}
  // });

  // function dealing(PostsReducedToTagData) {
  //   for (let key in obj) {

  //   }

  // }
  // .map((tags, index) => tags);
  // let singlePosts = PostsReducedToTagData.map(
  //   (individualPost, index) => individualPost[index],
  // );

  // let destructure = []
  //   .concat(...PostsReducedToTagData)
  //   .map((post) => post.tag_name);

  // console.log(Array.isArray(PostsReducedToTagData));
  // console.log(`tagName ${JSON.stringify(PostsReducedToTagData)} `);

  // let PostsReducedToTagData = posts.map((post, index) => post.tags);

  // for (let tag_name in PostsReducedToTagData) {
  //   console.log(PostsReducedToTagData[tag_name]);
  // }

  //  [
  //     [{"tag_name":"service-or-retail","$id":"67b23ddf000e2a1e5017","$createdAt":"2025-02-16T19:34:52.918+00:00","$updatedAt":"2025-02-16T19:53:53.644+00:00","$permissions":[],"$databaseId":"67b10c21001fa74929be","$collectionId":"67b10d930003325b94f0"}]
  //     ,
  //     [{"tag_name":"first-tech-job","$id":"67b23e6400018ac9a0cd","$createdAt":"2025-02-16T19:37:05.718+00:00","$updatedAt":"2025-02-16T20:37:33.821+00:00","$permissions":[],"$databaseId":"67b10c21001fa74929be","$collectionId":"67b10d930003325b94f0"},
  //     {"tag_name":"networking","$id":"67b23e470005b51b59d6","$createdAt":"2025-02-16T19:36:36.784+00:00","$updatedAt":"2025-02-16T20:37:33.762+00:00","$permissions":[],"$databaseId":"67b10c21001fa74929be","$collectionId":"67b10d930003325b94f0"}]
  //   ]

  //.map((tag) => tag.tag_name));
  //doesPostHaveAllTheTags(post, currenttags
  // console.log(
  //   `this is in the posts reduced to tags ${JSON.stringify(
  //     PostsReducedToTagData,
  //   )}`,
  // );

  // useEffect(() => {
  //   let currenttags = tagFilters;
  //   let filteringPosts = posts
  //     .flat(2)
  //     .filter((post) => doesPostHaveAllTheTags(post, currenttags));

  //   setFilteredPosts(filteringPosts);
  //   //we use POSTS, so we can get back filtered out posts if we remove tags
  //   // return currenttags.every((tag) => postsTagArray.includes(tag));
  // }, [tagFilters, posts]);

  // {PostsReducedToTagData.map((post) => (
  //   <div className="my-8"> {JSON.stringify(post)}</div>
  // ))}

  return (
    <div>
      <GeneralButton
        className="rounded-l-none"
        text={`${filterIsOpen ? "Close Filters" : "Open Filters"}`}
        onClick={() => SetFilterIsOpen(!filterIsOpen)}
      />
      <div className="flex">
        <FilteringSidebar
          category={categoriesAndTags}
          handleFilterChange={handleFilterChange}
          IsOpen={filterIsOpen}
        />

        <div className="flex-1">
          {filteredPosts.map((post) => (
            <div>
              <IndividualPost
                key={post.$id}
                post={post}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
