"use client";
import { useState, useEffect } from "react";
import GeneralButton from "../GeneralButton";
import FilteringSidebar from "../filtering/FilteringSidebar";
import IndividualPost from "./IndividualPost";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config/envConfig";
import Pagination from "../pagination";
import { getQueryClient } from "../react-query/GetQueryClient";

//<Post[]>'s type is written out in src/types.d.ts
export default function PostList({ categoriesAndTags, tagList }) {
  const queryClient = getQueryClient();
  //https://www.youtube.com/watch?v=XcUpTPbY4Wg
  const [currentPage, setCurrentPage] = useState(0);
  //1 since we're prefetching page 0 on the server
  const [unfilteredPostData, setUnfilteredPostData] = useState([]);
  const [tagFilters, setFiltersState] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterIsOpen, SetFilterIsOpen] = useState(true);
  const [lastId, setLastId] = useState();

  const useGetFetchedQueryData = (name) => {
    return queryClient.getQueriesData(name);
  };

  //takes too much time to put as UseState default state, will lead to a hydration error
  //so useEffect is needed to update the default initial value, to the unfilteredPosts from the server
  useEffect(() => {
    let dataFromServer = useGetFetchedQueryData(["posts"]);
    setUnfilteredPostData(dataFromServer[0][1]);
    setLastId(dataFromServer[0][dataFromServer.length - 1]);

    // let lastIdFromUnfilteredPosts =
    //   unfilteredPostData[unfilteredPostData.length - 1];
    // console.log(lastIdFromUnfilteredPosts);

    // setLastId(lastIdFromUnfilteredPosts);
  }, []);

  const fetchNextPosts = async function (page) {
    console.log("fetch post run");

    if (page === 0) {
      return;
    }
    let postsData = await axios.post(`/api/posts/`, {
      pageNumber: page,
      notFirstPage: true,
      lastId: lastId,
    });
    let { posts } = await postsData.data;

    return posts;
  };

  //queryKey "posts" contains prefetched data from the server page component
  // by using reactQuery we're passing this data to this component not through prop drilling, but by telling reactQuery to look at that key

  //but this data won't automatically be there, we need to tell it to get the initial props from the querykey posts's cache

  //initialDataUpdatedAt:
  //https://tanstack.com/query/latest/docs/framework/react/guides/initial-query-data#initial-data-from-the-cache-with-initialdataupdatedat

  const { data } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchNextPosts(currentPage),
    // initialData: () => useGetFetchedQueryData(["posts"]),
    // initialDataUpdatedAt: () =>
    //   queryClient.getQueryState(["posts"])?.dataUpdatedAt,
    gcTime: Infinity,
    subScribed: true,
    // keepPreviousData: true,
    enabled: !!currentPage,
  });

  // https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
  //gcInifity because we don't want inactive cache data to be tossed

  //initialPosts is a list of post objects

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

    if (unfilteredPostData) {
      console.log(
        `this is unFilteredPostsData${JSON.stringify(unfilteredPostData)}`,
      );
      // let lastIdFromUnfilteredPosts =
      //   unfilteredPostData[unfilteredPostData.length - 1].$id;

      // setLastId(lastIdFromUnfilteredPosts);
      console.log(`this is data ${JSON.stringify(data)}`);
      console.log(
        `this is getFetchedQueryData ${JSON.stringify(
          useGetFetchedQueryData(["posts"]),
        )}`,
      );
      setUnfilteredPostData(useGetFetchedQueryData(["posts"]));

      //grab all the data in react query for posts

      const allQueryData = queryClient.getQueryData(["posts"]);
      console.log(`this is allQueryData${JSON.stringify(allQueryData)}`);
    }

    //even witht he prefetech on the server page, reactQuery takes a second to grab the data, so we do if(data) so it waits for the data to load
    if (data) {
      setFilteredPosts(
        data.filter(
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
    }
  }, [tagFilters, data]);
  // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time tagFilters is changed

  return (
    <div className="bg-100devs">
      <span>
        {" "}
        {`this is allPostFromQuery ${JSON.stringify(unfilteredPostData)}`}
      </span>
      <button
        onClick={() => {
          // if (!isPreviousData && data.hasMore) {
          setCurrentPage((old) => old + 1);
          // }
        }}
      >
        {" "}
        click {currentPage}
      </button>
      <Pagination />
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
      <Pagination />
    </div>
  );
}
