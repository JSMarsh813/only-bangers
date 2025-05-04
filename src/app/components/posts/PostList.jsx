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
import CheckForMoreData from "../CheckForMoreDataButton";
import removeDeletedContent from "../../../utils/removeDeletedContent";
import { mutate as globalMutate } from "swr";

//<Post[]>'s type is written out in src/types.d.ts

export default function PostList({ categoriesAndTags, tagList, countOfPosts }) {
  // const queryClient = getQueryClient();
  //https://www.youtube.com/watch?v=XcUpTPbY4Wg
  // const [currentPage, setCurrentPage] = useState(0);
  //1 since we're prefetching page 0 on the server
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortingValue, setSortingValue] = useState(-1);
  const [sortingProperty, setSortingProperty] = useState("_id");
  const [currentlyClickedPage, setCurrentlyClickedPage] = useState(1);

  const [isFirstPageOfData, setIsFirstPageOfData] = useState(true);

  const [unfilteredPostData, setUnfilteredPostData] = useState([]);
  const [toggledTagFilters, setToggledTagFilters] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterIsOpen, SetFilterIsOpen] = useState(true);

  const [nameEdited, setNameEdited] = useState(false);

  const [deleteThisContentId, setDeleteThisContentId] = useState(null);
  const [processingPageChange, setProcessingPageChange] = useState(false);
  const [checkingForNewestData, setCheckingForNewestData] = useState(false);

  const [currentPostCount, setCurrentPostCount] = useState(countOfPosts);
  const [swrCacheNumberOfPages, setSwrCacheNumberOfPages] = useState(0);
  const [swrKeyLastId, setSwrKeyLastId] = useState(null);

  let itemsPerPageInServer = 120;
  // ########### SWR AND PAGINATION Section #################

  //Load more data by calling setSize(size + 1) when user scrolls or clicks "Load More". Each page's data is automatically merged into the posts array.
  // https://app.studyraid.com/en/read/11444/358629/implementing-pagination-with-useswrinfinite

  let filteredListLastPage = filteredPosts.length / itemsPerPage;

  // A function to get the SWR key of each page,
  // its return value will be accepted by `fetcher`.
  // If `null` is returned, the request of that page won't start.
  const getKey = (pageIndex, previousPageData, pageSize) => {
    // console.log("getKey called with:", {
    //   pageIndex,
    //   previousPageData,
    //   pageSize,
    // });

    // console.log(`this is testing swr pageIndex ${pageIndex}`);

    // console.log(`this is testing swr pageSize ${pageSize}`);

    // previous page data is just looking at the data from last fetched page
    // it will be null if we're on the first page OR if theres no more data to fetch
    // if the previousPageData has <= 120 items, then we know we ran out of posts

    if (
      // when a user manually asks us to check for more data, we need to tell it hey if we're checking for new data so don't return null
      !checkingForNewestData &&
      pageIndex !== 0 &&
      previousPageData &&
      previousPageData.length < itemsPerPageInServer
    ) {
      //otherwise if the last SWR page (previousPageData) has less than the 120 items the database sends, this means we reached the end of the list so don't keep checking
      console.log("getKey returned null");
      return null;
    } else {
      //checkingForNewestData has served its purpose, we're turning it back to false until the user Manually clicks "check for more data again"
      if (checkingForNewestData === true) setCheckingForNewestData(false);
    }
    //  Check if we reached the end, if so don't try to fetch more pages

    // console.log(`get key ran `);

    // we're using cursor based pagination, so we need to get the last id of the previous page to use as a cursor for the next page
    // if we're on the first page, there is no previousData so the lastId is null
    let lastIdOfCurrentData =
      previousPageData?.[previousPageData.length - 1]?.$id || null;

    // console.log(`this is lastIdInGetKey ${lastIdOfCurrentData}`);

    // itemsPerPage was taken out of the url, since we're going to always load 120 items for each call
    // why?
    // 1. this way even if a user requests 60 items per page, they still have the next 60 items ready to go
    // 2. this was to reduce requests to the server, 5 items would lead to LOTS of unnecessary server requests
    // since these requests have no images, aka its only text, this should not noticably effect the end user
    // another request to the server for another 120 posts, is only made when the user runs out of items

    //swr won't work if you take out the pageIndex, because thats how it knows what page of data its on

    // console.log(
    //   `Key for page ${pageIndex}:/api/posts/swr?page=${pageIndex}&lastId=${lastIdOfCurrentData}&sortingValue=${sortingValue}&sortingProperty=${sortingProperty}`,
    // );

    let SwrKey = `/api/posts/swr?page=${pageIndex}&lastId=${lastIdOfCurrentData}&sortingValue=${sortingValue}&sortingProperty=${sortingProperty}`;

    if (pageIndex > swrCacheNumberOfPages) {
      setSwrCacheNumberOfPages(pageIndex);
      setSwrKeyLastId(lastIdOfCurrentData);
    }

    return SwrKey;
    // SWR key, grab data from the next page (pageIndex+1) in each loop
  };
  // };

  //
  const {
    data, //array of page data
    //ex: data:
    // Array [ (2) […], (2) […] ]​
    // this is for page 0
    // 0: Array [ {...post 1}}, {...post 2}} ]
    // this if for page 1
    // 1: Array [ {...post 3}, {...post 4} ]​
    // length: 2
    error,
    isLoading,
    isValidating,
    mutate,
    size, // Number of pages that will be fetched and returned
    setSize, // Function to update the number of pages to be fetched
  } = useSWRInfinite(getKey, fetcher, {
    revalidateIfStale: false,
    revalidateOnMount: false,
    revalidateOnFocus: false, // Don't re-fetch when the window is focused, to reduce network requests to the free plan
    revalidateOnReconnect: false, //Don't re-fetch when the user regains an interenet connection, to reduce network requests on the free plan

    dedupingInterval: 10000, // dedupe requests with the same key in this time span in milliseconds, 10 seconds
    refreshInterval: 0, //Disabled by default (0)
    revalidateAll: false,
    revalidateFirstPage: false,
    parallel: false,
    keepPreviousData: true, //return the previous key's data until the new data has been loaded
    focusThrottleInterval: 60000, //only revalidate once during a time span in milliseconds, 1 minute
    errorRetryInterval: 60000, // error retry interval in milliseconds
    errorRetryCount: 3, // max error number of times to retry on error
  });

  //this post variable stores all the objects from all the pages in one array
  const posts = data ? [].concat(...data) : [];

  // console.log(JSON.stringify(data));
  let lastSwrPageHasLessThan120Items =
    data && data[data.length - 1]?.length < itemsPerPageInServer;
  let lastSwrPageIsFull =
    data && data[data.length - 1]?.length === itemsPerPageInServer;
  // if data exists
  // then lets grab the last page of data (lets say page 9)
  //  lets look at page 9's array length,
  // if it has less posts in it's array than the items per page we're asking for, then we know we've reached the end of the data

  // ###### duplicate code??? #######
  useEffect(() => {
    // console.log(data ? console.log("data:", data) : console.log("no data"));

    if (data && !isValidating) {
      // !isValidating is key for mutate to work with a specific key
      // otherwise data gets replaced with a string version of the swr key and rendering fails
      // ex data becomes "/","a","p","i","/","o","s","t","s"......
      // this forces it to wait until swr has updated that key
      setUnfilteredPostData([...posts]);
      // setFilteredPosts([...posts]);

      if (isFirstPageOfData === true) {
        setIsFirstPageOfData(false);
      }
    }
    // doing setProcessingPageChange(false) after the setPage is too early, since it takes time for it to process the data and update the filtered list
    // so setProcessingPageChange will only be set to false, after the data list has already been updated and any rendering changes have been made
    setProcessingPageChange(false);
  }, [data]);

  //data was necessary to make it work with swr

  useEffect(() => {
    mutate();
    //https://swr.vercel.app/docs/mutation#update-cache-after-mutation
    // mutate(cacheData, updatedPost {
    // populateCache: (updatedPost,cacheData)=>{
    // filter the list, and return it with the updated item
    // filter the list, and return it with the updated item
    //    return cacheData.map(post => post.$id===updatedPost.$id? updatedPost: post)
    //  },
    // Since the API already gives us the updated information,
    // we don't need to revalidate here.
    //    revalidate: false
    //  })
  }, [nameEdited]);

  function setCheckingForNewestDataFunction() {
    setCheckingForNewestData(true);

    if (lastSwrPageHasLessThan120Items) {
      //revalidate only the most current page/last page of swr

      let previousSwrKey = `/api/posts/swr?page=${swrCacheNumberOfPages}&lastId=${swrKeyLastId}&sortingValue=${sortingValue}&sortingProperty=${sortingProperty}`;

      mutate(data, {
        // only mutate/update if the swr key/url is equal to the previousSwrKey
        // ex: if /api/posts/swr?page=6&lastId=681729fd0022500a9cad&sortingValue=-1&sortingProperty=_id ===
        //        /api/posts/swr?page=6&lastId=681729fd0022500a9cad&sortingValue=-1&sortingProperty=_id
        // this tells it that this page should be invalidated, so regrab just THAT page
        revalidate: (pageData, url) => url === previousSwrKey,
      });

      //grabbing that specific page
      //https://swr.vercel.app/docs/mutation#update-cache-after-mutation
      setCheckingForNewestData(false);
    }

    if (lastSwrPageIsFull) {
      setSizeFunction(size + 1);
    }
  }

  function setItemsPerPageFunction(event) {
    setItemsPerPage(event);
  }

  function setNameEditedFunction() {
    setNameEdited(!nameEdited);
  }

  function setProcessingPageChangeFunction(boolean) {
    setProcessingPageChange(boolean);
  }

  function setCurrentlyClickedPageFunction(event) {
    //not setting the swr page
    setCurrentlyClickedPage(event);
  }

  function setSizeFunction(event) {
    setSize(event);
    //  && mutate();
  }

  useEffect(() => {
    //if the user changes the # of items per page, or changes how they want to sort the posts (ex: by oldest instead of newest) we want to reset the page to 1
    setCurrentlyClickedPage(1);
  }, [itemsPerPage, sortingValue, sortingProperty]);

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
  }, [toggledTagFilters, unfilteredPostData]);
  // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time toggledTagFilters is changed

  //########### Section that allows the deleted content to be removed without having to refresh the page, react notices that a key has been removed from the content list and unmounts that content ###########

  useEffect(() => {
    if (deleteThisContentId !== null) {
      removeDeletedContent(
        setUnfilteredPostData,
        unfilteredPostData,
        deleteThisContentId,
        setDeleteThisContentId,
      );
      setCurrentPostCount(currentPostCount - 1);
    }
  }, [deleteThisContentId]);

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
      {/* <div> {JSON.stringify(data)}</div> */}
      <Pagination
        currentlyClickedPage={currentlyClickedPage}
        itemsPerPage={itemsPerPage}
        filteredListLastPage={filteredListLastPage}
        lastSwrPageHasLessThan120Items={lastSwrPageHasLessThan120Items}
        setItemsPerPageFunction={setItemsPerPageFunction}
        setCurrentlyClickedPageFunction={setCurrentlyClickedPageFunction}
        setSizeFunction={setSizeFunction}
        size={size}
        filteredContentLength={filteredPosts.length}
        setSortingLogicFunction={setSortingLogicFunction}
        unfilteredPostDataLength={unfilteredPostData.length}
        processingPageChange={processingPageChange}
        setProcessingPageChangeFunction={setProcessingPageChangeFunction}
        swrCacheNumberOfPages={size}
        currentPostCount={currentPostCount}
      />
      {lastSwrPageHasLessThan120Items && (
        <CheckForMoreData
          currentlyClickedPage={currentlyClickedPage}
          filteredListLastPage={filteredListLastPage}
          setSizeFunction={setSizeFunction}
          lastSwrPageHasLessThan120Items={lastSwrPageHasLessThan120Items}
          swrCacheNumberOfPages={size}
          setCheckingForNewestDataFunction={setCheckingForNewestDataFunction}
        />
      )}

      <GeneralButton
        className="rounded-l-none ml-2 bg-yellow-200 text-blue-900  border-yellow-600"
        text={`${filterIsOpen ? "Close Filters" : "Open Filters"}`}
        onClick={() => SetFilterIsOpen(!filterIsOpen)}
      />
      <div className="flex bg-blue-950">
        <FilteringSidebar
          category={categoriesAndTags}
          handleFilterChange={handleFilterChange}
          IsOpen={filterIsOpen}
        />

        <div className="flex-1 border-t-4 border-blue-300">
          {isLoading && (
            <div className="flex">
              <span className="text-white text-3xl my-20 mx-auto">
                Fetching data ...
              </span>
            </div>
          )}

          {filteredPosts
            .slice(
              currentlyClickedPage == 1
                ? 0
                : (currentlyClickedPage - 1) * itemsPerPage, //index to start, we're starting at 0 or ex (1* 5 items = 5th index)
              currentlyClickedPage * itemsPerPage, //ending index
            )
            .map((post) => (
              <IndividualPost
                key={post.$id}
                post={post}
                tagList={tagList}
                setNameEditedFunction={setNameEditedFunction}
                setDeleteThisContentId={setDeleteThisContentId}
              />
            ))}
        </div>
      </div>
      {lastSwrPageHasLessThan120Items && (
        <CheckForMoreData
          currentlyClickedPage={currentlyClickedPage}
          filteredListLastPage={filteredListLastPage}
          setSizeFunction={setSizeFunction}
          lastSwrPageHasLessThan120Items={lastSwrPageHasLessThan120Items}
          swrCacheNumberOfPages={size}
          setCheckingForNewestDataFunction={setCheckingForNewestDataFunction}
        />
      )}
      <Pagination
        currentlyClickedPage={currentlyClickedPage}
        itemsPerPage={itemsPerPage}
        filteredListLastPage={filteredListLastPage}
        lastSwrPageHasLessThan120Items={lastSwrPageHasLessThan120Items}
        setItemsPerPageFunction={setItemsPerPageFunction}
        setCurrentlyClickedPageFunction={setCurrentlyClickedPageFunction}
        setSizeFunction={setSizeFunction}
        size={size}
        filteredContentLength={filteredPosts.length}
        setSortingLogicFunction={setSortingLogicFunction}
        unfilteredPostDataLength={unfilteredPostData.length}
        swrCacheNumberOfPages={size}
        currentPostCount={currentPostCount}
      />
    </div>
  );
}
