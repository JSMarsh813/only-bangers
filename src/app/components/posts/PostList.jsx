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
import calculateOldSwrPage from "../../../utils/calculateOldSwrPage";
import createSwrKey from "../../../utils/createSwrKey";
//<Post[]>'s type is written out in src/types.d.ts

async function checkingNextSwrPageLength(
  swrApiPath,
  oldSwrPage,
  oldSwrCursorKeyID,
  sortingValue,
  sortingProperty,
) {
  let swrKey = createSwrKey(
    swrApiPath,
    oldSwrPage,
    oldSwrCursorKeyID,
    sortingValue,
    sortingProperty,
  );

  //3 and a different id
  console.log(`this is swrKey in async ${swrKey}`);
  const response = await fetch(swrKey).then((res) => res.json());

  return response.length;

  // return newlyFetchedPostCount;
}

export default function PostList({
  swrApiPath,
  categoriesAndTags,
  tagList,
  countOfPosts,
}) {
  // const queryClient = getQueryClient();
  //https://www.youtube.com/watch?v=XcUpTPbY4Wg
  // const [currentPage, setCurrentPage] = useState(0);
  //1 since we're prefetching page 0 on the server
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortingValue, setSortingValue] = useState(-1);
  const [sortingProperty, setSortingProperty] = useState("_id");
  const [currentlyClickedPage, setCurrentlyClickedPage] = useState(1);

  const [unfilteredPostData, setUnfilteredPostData] = useState([]);
  const [toggledTagFilters, setToggledTagFilters] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterIsOpen, SetFilterIsOpen] = useState(true);

  const [nameEdited, setNameEdited] = useState(false);
  const [deleteThisContentId, setDeleteThisContentId] = useState(null);
  const [processingPageChange, setProcessingPageChange] = useState(false);
  const [checkingForNewestData, setCheckingForNewestData] = useState(false);

  const [totalPostCount, setTotalPostCount] = useState(countOfPosts);

  const [lastSwrPageIsFull, setLastSwrPageIsFull] = useState(false);
  // const [thereAreNewPosts, setThereAreNewPosts] = useState(false);

  let itemsPerPageInServer = 5;
  // ########### SWR AND PAGINATION Section #################

  //Load more data by calling setSize(size + 1)
  // Each page's data is added to the cache
  // https://app.studyraid.com/en/read/11444/358629/implementing-pagination-with-useswrinfinite

  let filteredListLastPage = filteredPosts.length / itemsPerPage;
  let loadedAllData = unfilteredPostData.length / totalPostCount >= 1;

  // its return value will be accepted by `fetcher`.
  // If `null` is returned, the request of that page won't start.
  const getKey = (pageIndex, previousPageData, pageSize) => {
    console.log("getKey called with:", {
      pageIndex,
      previousPageData,
      pageSize,
    });

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
    }

    //  Check if we reached the end, if so don't try to fetch more pages

    // console.log(`get key ran `);

    // we're using cursor based pagination, so we need to get the last id of the previous cached swr page to use as a cursor for the next page
    // if we're on the first page, there is no previousData so the lastId is null
    let lastIdOfCurrentData =
      previousPageData?.[previousPageData.length - 1]?.$id || null;
    console.log(`this is lastIdOfCurrentData ${lastIdOfCurrentData}`);
    // itemsPerPage was taken out of the url, since we're going to always load 120 items for each call
    // why?
    // 1. this way even if a user requests 60 items per page, they still have the next 60 items ready to go
    // 2. this was to reduce requests to the server, 5 items would lead to LOTS of unnecessary server requests
    // since these requests have no images, aka its only text, this should not noticably effect the end user
    // another request to the server for another 120 posts, is only made when the user runs out of items

    //swr won't work if you take out the pageIndex, because thats how it knows what page of data its on

    let SwrKeyInGetKey = createSwrKey(
      swrApiPath,
      pageIndex,
      lastIdOfCurrentData,
      sortingValue,
      sortingProperty,
    );

    return SwrKeyInGetKey;
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
    initialSize: 1,
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
  console.log(`this is data ${JSON.stringify(data)}`);
  if (error) {
    console.log("Theres was an error!:", error);

    return;
  }

  if (data && data.length === 0) {
    console.log("Theres was no data!:", data);
    return;
  }

  // console.log(JSON.stringify(data));
  const handleCheckBeforeCallingSetsize = async () => {
    let [oldSwrPage, _____] = calculateOldSwrPage(
      currentlyClickedPage,
      itemsPerPage,
      itemsPerPageInServer,
      unfilteredPostData,
    );

    let lastIdOfCurrentData =
      unfilteredPostData?.[unfilteredPostData.length - 1].$id || null;

    console.log(`this is oldSwrPage ${oldSwrPage} this is oldSwrCursorKeyId`);

    const newSwrPageLength = await checkingNextSwrPageLength(
      swrApiPath,
      oldSwrPage + 1,
      lastIdOfCurrentData,
      sortingValue,
      sortingProperty,
    );
    let responseIsAnInteger = Number.isInteger(newSwrPageLength);

    if (responseIsAnInteger && newSwrPageLength !== 0) {
      setSize(size + 1);
      setCurrentlyClickedPage(currentlyClickedPage + 1);
    } else {
      console.log(
        `An unexpected error occured! Was response an integer ${responseIsAnInteger}? and was newSwrPageLength ${newSwrPageLength} !===0 `,
      );
    }
  };

  useEffect(() => {
    if (!data) {
      //this is how we trigger swr to start on page load
      mutate();
    }

    if (data && !isValidating) {
      // when its validating, sometimes the data gets replaced with a string version of the swr key and rendering fails: ex: data: "/","a","p","i","/","o","s","t","s"......
      // so !isValidating forces it to wait until swr has finished validating that key
      setUnfilteredPostData([...posts]);

      //
    }
    // doing setProcessingPageChange(false) after the setPage is too early, since it takes time for it to process the data and update the filtered list
    // so setProcessingPageChange will only be set to false, after the data list has already been updated and any rendering changes have been made
    setProcessingPageChange(false);
  }, [data]);

  //data was necessary to make it work with swr

  useEffect(() => {
    if (nameEdited) {
      let [oldSwrPage, oldSwrCursorKeyID] = calculateOldSwrPage(
        currentlyClickedPage,
        itemsPerPage,
        itemsPerPageInServer,
        unfilteredPostData,
      );

      let previousSwrKey = createSwrKey(
        swrApiPath,
        oldSwrPage,
        oldSwrCursorKeyID,
        sortingValue,
        sortingProperty,
      );

      mutate(data, {
        // only mutate/update if the swr key/url is equal to the previousSwrKey we're looking for
        // ex: if /api/posts/swr?page=6&lastId=681729fd0022500a9cad&sortingValue=-1&sortingProperty=_id ===
        //        /api/posts/swr?page=6&lastId=681729fd0022500a9cad&sortingValue=-1&sortingProperty=_id
        // this tells it that this page should be invalidated, so regrab just THAT page
        revalidate: (pageData, url) => url === previousSwrKey,
      });

      setNameEdited(false);
      //if we don't set nameEdited back to false, then if we edit another post swr won't update
      // when we editing another post ==> we setNameEdited(true)
      // but this useEffect won't be triggered, since nameEdited already had the true value
    }
  }, [nameEdited]);

  // useEffect(() => {
  //   if (lastSwrPageIsFull === true && thereAreNewPosts) {
  //     //no point in revalidating the last swr page since its full
  //     // have swr start on a new swr page to add to the cache

  //     //check the size on server,
  //     //is there more data?
  //     //if so return the new data

  //     setSize(size + 1);
  //     setThereAreNewPosts(false);
  //   } else if (lastSwrPageIsFull === true && !thereAreNewPosts) {
  //     console.log("no new posts available");
  //   } else {
  //     console.log(
  //       "thereAreNewPosts value changed, but lastSwrPageIsFull was false",
  //     );
  //   }
  // }, [thereAreNewPosts]);

  function setCheckingForNewestDataFunction() {
    console.log("set checking for newest data func ran");
    setCheckingForNewestData(true);
    console.log(`this checking for newest data ${checkingForNewestData}`);
    console.log(`this is size in checking ${size}`);

    // does the last swr page in cache have 120 of 120 items?

    //NO: its not full
    // we'd just have swr revalidate the last swr key in the cache
    // we won't ask it to grab the next swr page, since this page is not full yet

    //YES: its full
    // if the last page is full 120/120 , then we'll want to call swr to grab another page of data to add to cache

    if (!data) {
      console.error("error, no data was found");
      return;
    }

    let lastSwrPage = data[data.length - 1];
    let secondToLastSwrPage = data[data.length - 2];

    console.log(`lastSwrPage${JSON.stringify(lastSwrPage)}`);
    console.log(`
      secondToLastSwrPage  ${JSON.stringify(secondToLastSwrPage)}`);

    console.log(
      `lastSwrPage${lastSwrPage.length}  secondToLastSwrPage  ${secondToLastSwrPage.length}`,
    );

    let lastSwrPageLength = lastSwrPage?.length
      ? lastSwrPage.length
      : secondToLastSwrPage.length;

    console.log(` lastSwrPageLength${lastSwrPageLength}`);

    let isLastSwrPageFull = lastSwrPageLength === itemsPerPageInServer;

    console.log(`isLastSwrPageFull ${isLastSwrPageFull}`);

    //other logic will use isLastSwrPageFull, so we added it to state
    //but we can't use that state value below, because it will not return in time. So we'd be getting the old value by grabbing the state variable
    setLastSwrPageIsFull(isLastSwrPageFull);

    if (isLastSwrPageFull === false) {
      // since theres still room for more items, there's no reason to download the next page
      //just revalidate/recheck the most current page/last page of swr for additional posts
      console.log(`isLastSwrPageFull === false `);

      let [oldSwrPage, oldSwrCursorKeyID] = calculateOldSwrPage(
        currentlyClickedPage,
        itemsPerPage,
        itemsPerPageInServer,
        unfilteredPostData,
      );

      let previousSwrKey = createSwrKey(
        swrApiPath,
        oldSwrPage,
        oldSwrCursorKeyID,
        sortingValue,
        sortingProperty,
      );

      mutate(data, {
        // only mutate/update if the swr key/url is equal to the previousSwrKey
        // ex: if /api/posts/swr?page=6&lastId=681729fd0022500a9cad&sortingValue=-1&sortingProperty=_id ===
        //        /api/posts/swr?page=6&lastId=681729fd0022500a9cad&sortingValue=-1&sortingProperty=_id
        // this tells it that this page should be invalidated, so regrab just THAT page
        revalidate: (pageData, url) => url === previousSwrKey,
      });
      //we completed the check, return to false to the user can check again for new posts if they like
      console.log("check, we're manually rechecking the page");
      console.log(`this checking for newest data ${checkingForNewestData}`);

      setTimeout(() => {
        setCheckingForNewestData(false);
      }, 60000);
      // ;
    } else if (isLastSwrPageFull === true) {
      handleCheckBeforeCallingSetsize();
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
    //this is only changing the page the user visually sees
    //this will not change the swr cache page
    setCurrentlyClickedPage(event);
  }

  function setSizeFunction(event) {
    setSize(event);
  }

  useEffect(() => {
    //if the user changes the # of items per page, or changes how they want to sort the posts (ex: by oldest instead of newest)
    // we want to reset the page to 1
    setCurrentlyClickedPage(1);
  }, [itemsPerPage, sortingValue, sortingProperty]);

  function setSortingLogicFunction(optionValue) {
    // onChange={(e) => setSortingLogicFunction(e.target.value)}
    // the target's value has 2 strings,
    // ex: <option value="createdAt,oldest">Oldest </option>

    setSortingProperty(optionValue.split(",")[0]);
    // createdAt
    setSortingValue(optionValue.split(",")[1]);
    // oldest or newest
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
      setTotalPostCount(totalPostCount - 1);
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
      <div className="text-white">
        {" "}
        <button
          type="button"
          onClick={() => setCheckingForNewestData(true)}
        >
          {" "}
          click{" "}
        </button>
        {`this is checking for newest Data ${checkingForNewestData}`}{" "}
      </div>

      <Pagination
        currentlyClickedPage={currentlyClickedPage}
        itemsPerPage={itemsPerPage}
        filteredListLastPage={filteredListLastPage}
        lastSwrPageIsNotFull={!lastSwrPageIsFull}
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
        totalPostCount={totalPostCount}
      />
      {loadedAllData && (
        <CheckForMoreData
          currentlyClickedPage={currentlyClickedPage}
          filteredListLastPage={filteredListLastPage}
          setCheckingForNewestDataFunction={setCheckingForNewestDataFunction}
          checkingForNewestData={checkingForNewestData}
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
      {loadedAllData && (
        <CheckForMoreData
          currentlyClickedPage={currentlyClickedPage}
          filteredListLastPage={filteredListLastPage}
          setSizeFunction={setSizeFunction}
          lastSwrPageIsNotFull={!lastSwrPageIsFull}
          swrCacheNumberOfPages={size}
          setCheckingForNewestDataFunction={setCheckingForNewestDataFunction}
          checkingForNewestData={checkingForNewestData}
        />
      )}
      <Pagination
        currentlyClickedPage={currentlyClickedPage}
        itemsPerPage={itemsPerPage}
        filteredListLastPage={filteredListLastPage}
        lastSwrPageIsNotFull={!lastSwrPageIsFull}
        setItemsPerPageFunction={setItemsPerPageFunction}
        setCurrentlyClickedPageFunction={setCurrentlyClickedPageFunction}
        setSizeFunction={setSizeFunction}
        size={size}
        filteredContentLength={filteredPosts.length}
        setSortingLogicFunction={setSortingLogicFunction}
        unfilteredPostDataLength={unfilteredPostData.length}
        swrCacheNumberOfPages={size}
        totalPostCount={totalPostCount}
      />
    </div>
  );
}
