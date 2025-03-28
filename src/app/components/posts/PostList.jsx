"use client";
import { useState, useEffect } from "react";
import GeneralButton from "../GeneralButton";
import FilteringSidebar from "../filtering/FilteringSidebar";
import IndividualPost from "./IndividualPost";
import { useQuery } from "@tanstack/react-query";
// **** initial posts prop is no longer used
//<Post[]>'s type is written out in src/types.d.ts
export default function PostList({ categoriesAndTags, tagList }) {
  //https://www.youtube.com/watch?v=XcUpTPbY4Wg

  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      let postsData = await axios.get(`${conf.baseFetchUrl}/api/posts`);
      let { posts } = postsData.data;
      return posts;
    },
  });
  console.log(`this is data in PostList ${JSON.stringify(data)}`);

  //initialPosts is a list of post objects
  const [posts, setPosts] = useState([...data]);
  const [tagFilters, setFiltersState] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterIsOpen, SetFilterIsOpen] = useState(true);

  //setPosts grabs the initialPosts prop and says hey, this is list of posts is my starting state

  //adding or removing filters that we're looking for
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    checked
      ? setFiltersState([...tagFilters, value])
      : setFiltersState(tagFilters.filter((tag) => tag != value));
  };

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

  return (
    <div className="bg-100devs">
      <GeneralButton
        className="rounded-l-none ml-2 bg-yellow-200 text-100devs  border-yellow-600"
        text={`${filterIsOpen ? "Close Filters" : "Open Filters"}`}
        onClick={() => SetFilterIsOpen(!filterIsOpen)}
      />
      <div className="flex bg-blue-900">
        <FilteringSidebar
          category={categoriesAndTags}
          handleFilterChange={handleFilterChange}
          IsOpen={filterIsOpen}
        />

        <div className="flex-1 border-t-4 border-blue-300">
          {filteredPosts.map((post) => (
            <IndividualPost
              key={post.$id}
              post={post}
              tagList={tagList}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
