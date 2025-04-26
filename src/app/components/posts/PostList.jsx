"use client";
import { useState, useEffect } from "react";
import GeneralButton from "../GeneralButton";
import FilteringSidebar from "../filtering/FilteringSidebar";
import IndividualPost from "./IndividualPost";
// import { useInfiniteQuery } from "@tanstack/react-query";
import fetcher from "@/utils/swrFetcher";
import useSWRInfinite from "swr/infinite";
import axios from "axios";
import conf from "@/config/envConfig";
import Pagination from "../pagination";
// import { getQueryClient } from "../react-query/GetQueryClient";

//<Post[]>'s type is written out in src/types.d.ts
export default function PostList({ categoriesAndTags, tagList }) {
  // const queryClient = getQueryClient();
  //https://www.youtube.com/watch?v=XcUpTPbY4Wg
  // const [currentPage, setCurrentPage] = useState(0);
  //1 since we're prefetching page 0 on the server
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortingvalue, setSortingValue] = useState(-1);
  const [sortingproperty, setSortingProperty] = useState("_id");
  const [page, setPage] = useState(1);
  const [isFirstPageOfData, setIsFirstPageOfData] = useState(true);

  const [unfilteredPostData, setUnfilteredPostData] = useState([]);
  const [toggledTagFilters, setToggledTagFilters] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterIsOpen, SetFilterIsOpen] = useState(true);
  const [lastId, setLastId] = useState(null);

  // ########### SWR AND PAGINATION Section #################

  //Load more data by calling setSize(size + 1) when user scrolls or clicks "Load More". Each page's data is automatically merged into the posts array.
  // https://app.studyraid.com/en/read/11444/358629/implementing-pagination-with-useswrinfinite

  const PAGE_SIZE = itemsPerPage;
  let filteredListLastPage = filteredPosts.length / itemsPerPage;

  // A function to get the SWR key of each page,
  // its return value will be accepted by `fetcher`.
  // If `null` is returned, the request of that page won't start.
  const getKey = (
    pageIndex,
    previousPageData,
    pagesize,
    sortingvalue,
    sortingproperty,
  ) => {
    console.log("getKey called with:", { pageIndex, previousPageData });

    // Check if we reached the end, if so don't try to fetch more pages
    if (previousPageData && !previousPageData.length) return null;
    console.log(`get key ran `);
    console.log(`this is previousPageData ${JSON.stringify(previousPageData)}`);
    const lastIdInGetKey =
      previousPageData?.[previousPageData.length - 1]?.$id || null;
    console.log(`this is lastIdInGetKey ${lastIdInGetKey}`);

    return `/api/posts/swr?page=${pageIndex}&lastId=${lastIdInGetKey}`;
    // SWR key, grab data from the next page (pageIndex+1) in each loop
  };
  // };

  //
  const {
    data, //array of page data
    error,
    isLoading,
    isValidating,
    mutate,
    size, // Number of pages to display
    setSize, // Function to update the number of pages
  } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false, // Don't re-fetch when the window is focused, to reduce network requests to the free plan
    revalidateOnReconnect: false, //Don't re-fetch when the user regains an interenet connection, to reduce network requests on the free plan
    dedupingInterval: 10000, // dedupe requests with the same key in this time span in milliseconds 10 seconds
    refreshInterval: 0, //Disabled by default (0)
    keepPreviousData: true, //return the previous key's data until the new data has been loaded
    focusThrottleInterval: 5000, //only revalidate once during a time span in milliseconds
    errorRetryInterval: 5000, // error retry interval in milliseconds
    errorRetryCount: 3, // max error number of times to retry on error
  });

  console.log("no data");

  const posts = data ? [].concat(...data) : [];

  let isAtEnd = data && data[data.length - 1]?.length < 1;

  useEffect(() => {
    console.log(data ? console.log("data") : console.log("no data"));

    if (data) {
      setFilteredPosts([...posts]);
      setUnfilteredPostData([...posts]);

      if (isFirstPageOfData === true) {
        setIsFirstPageOfData(false);
      }
    }
  }, [data]);

  //data was necessary to make it work with swr

  function setItemsPerPageFunction(event) {
    setItemsPerPage(event);
  }

  function setPageFunction(event) {
    setPage(event);
  }

  function setSizeFunction(event) {
    setSize(event) && mutate();
  }

  useEffect(() => {
    setPage(1);
  }, [itemsPerPage, sortingvalue, sortingproperty]);

  function setSortingLogicFunction(event) {
    // setSortingLogicString(event);
    setSortingValue(event.split(",")[1]);
    setSortingProperty(event.split(",")[0]);
  }

  useEffect(() => {
    if (unfilteredPostData && unfilteredPostData.length > 0) {
      setFilteredPosts(
        unfilteredPostData.filter((object) =>
          //we're iterating through every post object we've gotten back from the server

          toggledTagFilters.every((tag) =>
            // then for every post, we're iterating through every filter the user has toggled on
            // we are filtering based on the tags, every toggled tag needs to return yes, I exist inside this object/post's tags

            object.tags
              .map(
                (tag) =>
                  //we need to trim the object down to just tag names, so we use object.tags to get an array of tag  objects

                  // ex: [{"tag_name":"networking","$id":"67c8105f002a68d2e2ab","$createdAt":"2025-03-05T08:50:38.227+00:00","$updatedAt":"2025-03-05T09:02:52.882+00:00"}]

                  // then we use map to iterate through this array of tag objects
                  tag.tag_name,
                //we then trim the tag object to just the tag_name property, so we can compare it to the toggled tag filter
              )
              .includes(tag),
          ),
        ),
      );
    }
  }, [toggledTagFilters, data]);
  // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time toggledTagFilters is changed

  //#################### END of SWR section ##############

  //adding or removing filters that we're looking for
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    checked
      ? setToggledTagFilters([...toggledTagFilters, value])
      : setToggledTagFilters(toggledTagFilters.filter((tag) => tag != value));
  };

  return (
    <div className="bg-100devs">
      <span>
        {`this is lastid ${JSON.stringify(lastId)}`}
        {`this is allPostFromQuery ${JSON.stringify(unfilteredPostData)}`}
      </span>
      {/* <button
        onClick={() => {
          // if (!isPreviousData && data.hasMore) {
          setCurrentPage((old) => old + 1);
          fetchNextPage();
          // }
        }}
      >
        {" "}
        click {currentPage}
      </button> */}

      <button onClick={() => setSize(size + 1)}>Load More</button>
      <button onClick={() => grabLastIdFromList(unfilteredPostData)}>
        Load More
      </button>

      <Pagination
        page={page}
        itemsPerPage={itemsPerPage}
        filteredListLastPage={filteredListLastPage}
        isAtEnd={isAtEnd}
        setItemsPerPageFunction={setItemsPerPageFunction}
        setPageFunction={setPageFunction}
        setSizeFunction={setSizeFunction}
        size={size}
        filteredContentLength={filteredPosts.length}
        setSortingLogicFunction={setSortingLogicFunction}
      />

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
          {JSON.stringify(filteredPosts)}
          {/* {filteredPosts.map((post) => (
            <IndividualPost
              key={post.$id}
              post={post}
              tagList={tagList}
            />
          ))} */}
        </div>
      </div>
      <Pagination />
    </div>
  );
}
