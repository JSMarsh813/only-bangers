"use client";
import { useState, useEffect } from "react";
import GeneralButton from "../GeneralButton";
import FilteringSidebar from "../filtering/FilteringSidebar";
import IndividualPost from "./IndividualPost";

import fetcher from "@/utils/swr/swrFetcher";
import useSWRInfinite from "swr/infinite";

import Pagination from "../pagination";

import CheckForMoreData from "../CheckForMoreDataButton";
import removeDeletedContent from "../../../utils/removeDeletedContent";

import {
  calculateOldSwrPage,
  calculateOldSwrCursor,
} from "../../../utils/swr/calculateSwrKeyPieces";
import createSwrKey from "../../../utils/swr/createSwrKey";
import filteringPosts from "../../../utils/filtering/filteringPosts";
import revalidateOnlyThisSwrPage from "../../../utils/swr/revalidateOnlyThisSwrPage";
import calculateSwrPageFromIndex from "../../../utils/swr/calculateSwrPageFromIndex";
import getPostCountFromServer from "../../../utils/getPostCountFromServer";

import { revalidateMultipleSwrPage } from "../../../utils/swr/revalidateOnlyThisSwrPage";

async function mostCurrentPostCountFromServerFunc() {
  try {
    const countFromServer = await getPostCountFromServer();
    console.log("Post count from server:", countFromServer);
    // Use countFromServer as needed
    return countFromServer;
  } catch (error) {
    console.error("Error fetching post count:", error);
  }
}

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

  console.log(
    `this is oldSwrCursorKeyID in checkingNextSwrPageLength ${JSON.stringify(
      oldSwrCursorKeyID,
    )}`,
  );
  const response = await fetch(swrKey).then((res) => res.json());
  console.log(`checking next swr page lengt ${response.length}`);

  return response.length;
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

  const [filtersWereToggled, setFiltersWereToggled] = useState(false);
  const [changedItemsSwrPage, setChangedItemsSwrpage] = useState(null);
  const [greatestClickedSwrPage, setGreatestClickedSwrPage] = useState(1);

  const [automaticallyLoadingMoreData, setAutomaticallyLoadingMoreData] =
    useState(false);

  // ################################   SWR AND PAGINATION Section ##############################################

  function setChangedItemsSwrPageFunction(postsSwrPageProperty) {
    setChangedItemsSwrpage(postsSwrPageProperty);
  }

  const itemsPerPageInServer = 5;
  let loadedAllData = unfilteredPostData.length / totalPostCount >= 1;
  let filteredListLastPage = filteredPosts.length / itemsPerPage;

  const getKey = (pageIndex, previousPageData, pageSize) => {
    // A function to get the SWR key of each page,
    // its return value will be accepted by `fetcher`.
    // previous page data is just looking at the data from last fetched page

    if (
      // when a user manually asks us to check for more data, we need to tell it hey if we're checking for new data so don't return null
      !checkingForNewestData &&
      // previousPageData will be null if we're on the first page OR if theres no more data to fetch
      pageIndex !== 0 &&
      // if the previousPageData has <= 120 items, then we know we ran out of posts
      previousPageData &&
      previousPageData.length < itemsPerPageInServer
    ) {
      // If `null` is returned, the request of that page won't start.
      return null;
    }

    // we're using cursor based pagination, so we need to get the last id of the previous cached swr page to use as a cursor for the next page
    // if we're on the first page, there is no previousData so the lastId is null
    let lastIdOfCurrentData =
      previousPageData?.[previousPageData.length - 1].$id || null;

    //swrInfinite won't work if you take out the pageIndex, because thats how it knows what page of data its on

    let SwrKeyInGetKey = createSwrKey(
      swrApiPath,
      pageIndex,
      lastIdOfCurrentData,
      sortingValue,
      sortingProperty,
    );
    console.log(
      `this is oldSwrCursorKeyID in SwrKeyInGetKey${JSON.stringify(
        lastIdOfCurrentData,
      )}`,
    );

    return SwrKeyInGetKey;
    // SWR key, grab data from the next page (pageIndex+1) in each loop
  };
  // };

  //
  const {
    data,
    // Each page's data is added to the cache
    // https://app.studyraid.com/en/read/11444/358629/implementing-pagination-with-useswrinfinite
    //data: array of multiple api responses
    //ex:
    // Array [ (2) […], (2) […] ]​
    // page 0
    // 0: Array [
    // {...post 1}},
    //  {...post 2}}
    //]
    //  page 1
    // 1: Array [
    // {...post 3},
    // {...post 4}
    //]​
    // length: 2
    error,
    isLoading,
    isValidating,
    mutate,
    size, // Number of pages that will be fetched and returned
    setSize, // Function to update the number of pages to be fetched, this is how we load the next page
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
  console.log("posts ran");

  if (error) {
    console.error("Theres was an error!:", error);
    return;
  }

  if (data && data.length === 0) {
    console.error("Theres was no data!:", data);
    return;
  }

  useEffect(() => {
    console.log("look data changed");
    if (!data) {
      //this is how we trigger swr to start on initial page load
      mutate();
    }

    if (data && !isValidating) {
      // when its validating, sometimes the data gets replaced with a string version of the swr key and rendering fails: ex: data: "/","a","p","i","/","o","s","t","s"......
      // so !isValidating forces it to wait until swr has finished validating that key
      const postsWithSwrPage = posts.map((item, index) => ({
        ...item,
        swrPage: calculateSwrPageFromIndex(index, itemsPerPageInServer),
      }));

      setUnfilteredPostData([...postsWithSwrPage]);
      //
    }

    // setProcessingPageChange will only be set to false, after the data list has already been updated
    // this way the user will see rendered changes, so they can't click to the next page too early
    setProcessingPageChange(false);
  }, [data]);

  // #############################   SWR: EDIT SECTION  ################################

  function setNameEditedFunction() {
    setNameEdited(!nameEdited);
  }

  useEffect(() => {
    if (nameEdited) {
      // let oldSwrPage = calculateOldSwrPage(
      //   currentlyClickedPage,
      //   itemsPerPage,
      //   itemsPerPageInServer,
      // );

      console.log(
        `this was edited names changedItemsSwrPage ${changedItemsSwrPage}`,
      );

      mutate(data, {
        revalidate: (pageData, url) => {
          return revalidateOnlyThisSwrPage(url, changedItemsSwrPage);
        },
      });

      console.log("past mutation area ");
      setNameEdited(false);
      // setChangedItemsSwrpage(null);
      //if we don't set nameEdited back to false, then if we edit another post, swr won't update because this useEffect wouldn't be trigger
    }
  }, [nameEdited]);

  // ##############################    SWR: CHECKING FOR NEW DATA    ###################################

  function setProcessingPageChangeFunction(boolean) {
    setProcessingPageChange(boolean);
  }

  const handleCheckBeforeCallingSetsize = async () => {
    console.log("handleCheckBeforeCallingSetSize ran");
    let oldSwrPage = calculateOldSwrPage(
      currentlyClickedPage,
      itemsPerPage,
      itemsPerPageInServer,
      unfilteredPostData,
    );

    console.log(
      `this is unFilteredPostData in handleCheck ${JSON.stringify(
        unfilteredPostData,
      )}`,
    );

    let lastIdOfCurrentData =
      unfilteredPostData[unfilteredPostData.length - 1].$id || null;

    //calculates oldSwrPage and lastId with the 2 functions above
    const newSwrPageLength = await checkingNextSwrPageLength(
      swrApiPath,
      oldSwrPage + 1,
      lastIdOfCurrentData,
      sortingValue,
      sortingProperty,
    );
    let responseIsAnInteger = Number.isInteger(newSwrPageLength);

    if (responseIsAnInteger && newSwrPageLength !== 0) {
      setProcessingPageChangeFunction(false);
      setSize(size + 1);
      // EDGE CASE:
      //logic below takes in account if someone has filtered the data
      // lets say the user was on the client side page 1 with 5 items per page
      // if after they clicked a tag, only 1 item from theSWRpage was a match
      // then we're automatically try to load the next 4 from SWRpage2
      // but we're technically still on the client side page 1, even though we're on swrPage2
      // otherwise the user will see an empty page 2 and have to click backwards to page 1
      let updatedPageNumber =
        Math.floor(filteredPosts.length / itemsPerPage) + 1;
      setCurrentlyClickedPage(updatedPageNumber);
    } else if (responseIsAnInteger && newSwrPageLength === 0) {
      console.log(
        `There is no more data to load. The new SWR page's length was ${newSwrPageLength}!`,
      );
      setProcessingPageChangeFunction(false);
    } else {
      console.log(
        `An unexpected error occured! The new SWR page's length was not an integer value ${responseIsAnInteger}?`,
      );
      setProcessingPageChangeFunction(false);
    }
  };

  function allowRecheckForDataAfterDelay() {
    setTimeout(() => {
      //we completed revalidating the page, return state to false so they can check again for new posts
      setCheckingForNewestData(false);
    }, 30000);
  }

  function setCheckingForNewestDataFunction() {
    setCheckingForNewestData(true);

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

    // handling an edge case, if the last Swr Page's length is 0, we want to ignore it

    //############# CHECK TOMORROW
    let lastSwrPage = data[data.length - 1];
    let secondToLastSwrPage = data[data.length - 2];

    let lastSwrPageLength = lastSwrPage?.length
      ? lastSwrPage.length
      : secondToLastSwrPage.length;

    let isLastSwrPageFull = lastSwrPageLength === itemsPerPageInServer;
    setLastSwrPageIsFull(isLastSwrPageFull);

    if (isLastSwrPageFull === false) {
      // theres still room for more items, so just revalidate/recheck the most current page for new posts

      let oldSwrPage = calculateOldSwrPage(
        currentlyClickedPage,
        itemsPerPage,
        itemsPerPageInServer,
      );

      let oldSwrCursorKeyID = calculateOldSwrCursor(
        oldSwrPage,
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

      console.log(
        `this is oldSwrCursorKeyID in isLastSwrPageFull ${JSON.stringify(
          oldSwrCursorKeyID,
        )}`,
      );
      mutate(data, {
        // only mutate/update if the swr key/url is equal to the previousSwrKey url
        // this tells it that this page should be invalidated, so regrab just THAT page
        revalidate: (pageData, url) => url === previousSwrKey,
      });
      allowRecheckForDataAfterDelay();
      // ;
    } else if (isLastSwrPageFull === true) {
      //deals with the edge case of not knowing if the next page has data or not
      //if you asked for the next page with setSize() but the next page was empty,
      //then next time you asked, it would increase the size value, but it would never grab the new data
      //so this is a workaround
      handleCheckBeforeCallingSetsize();
      allowRecheckForDataAfterDelay();
    } else {
      console.error(
        `an error occured when rechecking the data! isLastSwrPageFull should be a boolean but it was instead ${isLastSwrPageFull}`,
      );
    }
  }

  //#################################  SWR:  DELETION  #######################################################

  useEffect(() => {
    if (deleteThisContentId !== null) {
      console.log("deletion mutation ran");
      mutate(data, {
        revalidate: (pageData, url) => {
          return revalidateMultipleSwrPage(url, changedItemsSwrPage);
        },
      });
      setTotalPostCount(totalPostCount - 1);

      // removeDeletedContent(
      //   setUnfilteredPostData,
      //   unfilteredPostData,
      //   deleteThisContentId,
      //   setDeleteThisContentId,
      // );
      // setTotalPostCount(totalPostCount - 1);
    }
  }, [deleteThisContentId]);

  //########################################  END OF SWR SECTION ################################################

  function setItemsPerPageFunction(event) {
    setItemsPerPage(event);
  }

  function setCurrentlyClickedPageFunction(event) {
    //this is only changing the page the user visually sees
    //this will not change the swr cache page
    setCurrentlyClickedPage(event);
  }

  function setSizeFunction(event) {
    setSize(event);
  }

  const handleCheckBeforeGrabbingMoreFilteredData = async () => {
    const mostCurrentPostCountFromServer =
      await mostCurrentPostCountFromServerFunc();

    console.log(
      `ran, mostCurrentPostCountFromServer ${JSON.stringify(
        mostCurrentPostCountFromServer,
      )}`,
    );

    if (filteredPosts.length < mostCurrentPostCountFromServer) {
      console.log(
        `ran, filteredPosts.length < mostCurrentPost Count From Server ${filteredPosts.length}  ${mostCurrentPostCountFromServer}`,
      );
      handleCheckBeforeCallingSetsize();
    } else {
      setProcessingPageChangeFunction(false);
      console.log("no more data available to load");
    }
  };

  useEffect(() => {
    //keeping track of the last Swr page we loaded
    let floatValueOfGreatestSwrPage =
      unfilteredPostData.length / itemsPerPageInServer;

    if (floatValueOfGreatestSwrPage === 0) {
      return;
    }

    let greatestSwrPage = Number.isInteger(floatValueOfGreatestSwrPage)
      ? floatValueOfGreatestSwrPage
      : Math.floor(floatValueOfGreatestSwrPage) + 1;

    if (greatestClickedSwrPage < greatestSwrPage) {
      setGreatestClickedSwrPage(greatestSwrPage);
    }
  }, [unfilteredPostData]);

  useEffect(() => {
    // ######## FOR USERS FILTERING DATA ###########

    // checks for more posts automatically for filtered users
    // so for example swrpage 2 is full
    // but they only have 2 posts on page 1 that match their filters

    if (unfilteredPostData.length === 0) {
      // this will run during this initial render, we don't want it to do anything yet
      // if unfilteredPostData's length is 0, then this is the initial render, we want to ignore this
      //if we let it go, it would cause errors downstream since unfilteredpostdata is empty
      return;
    }

    if (processingPageChange) {
      //without this check, if the user clicked the > arrow, we'd be loading 2 pages

      // this check tells it, hey processingPageChange is true so we're already grabbing data
      //  so useEffect, ignore this page change, this call wasn't intended for you
      return;
    }

    if (
      currentlyClickedPage != 1 &&
      currentlyClickedPage <= greatestClickedSwrPage
    ) {
      // ignore this page click, we're just going back a page, don't load data
      return;
    }

    let amountOfItemsThatShouldBeLoaded = currentlyClickedPage * itemsPerPage;
    console.log(
      `this is amoutn of items that should be loaded ${amountOfItemsThatShouldBeLoaded}`,
    );

    if (
      currentlyClickedPage === 1 &&
      filteredPosts.length >= amountOfItemsThatShouldBeLoaded
    ) {
      //edge case, we still want this to run if the user is changing the amount of items per page
      // however, if they haven't changed the items per page (ex 5) and are just clicking back onto page 1, we want the useEffect to ignore that page change
      return;
    }

    if (filteredPosts.length < amountOfItemsThatShouldBeLoaded) {
      setAutomaticallyLoadingMoreData(true);
      setProcessingPageChangeFunction(true);
      console.log(
        "ran, filtered posts length is less than amount of items that should be loaded",
      );
      handleCheckBeforeGrabbingMoreFilteredData();
    }

    if (unfilteredPostData.length === countOfPosts) {
      setAutomaticallyLoadingMoreData(false);
    }
    if (filteredPosts.length >= amountOfItemsThatShouldBeLoaded) {
      setAutomaticallyLoadingMoreData(false);
    }
    //needs to be triggered either when
    // 1. filteredPosts changes,

    //so this will run at startup, since filteredPosts will be filled with data from unfilteredPosts, so we do if (unfilteredPostData.length === 0) return to tell this useEffect to ignore the 1st time it's invocated

    // to fill up the client side page 1 with items that match their filters, we might need to grab from more than 1, 2, 3 ect swr/server pages

    //so it keeps running this logic until the number of items on the page matches what it should be, or the server runs out of data

    //2. currentlyClickedPage
    // after we fill up client side page 1 with filtered data

    //the 4 server SWR pages of data might of had 1 or 2 extra items that fit the filters, that page 1 didn't need

    // so we need to tell it, hey if the user clicks on the 2nd page, make sure page 2 ALSO has enough items from the server to fill up page 2

    //3. itemsPerPage
    //if someone changes from the default 5 items per page to 15 ect, we tell swr hey fetch enough posts to get to 15 posts for the page
  }, [filteredPosts, currentlyClickedPage, itemsPerPage]);

  useEffect(() => {
    // Edge Case Solved for sorting:
    // When a user loads all posts for:
    //                 Newest posts 16
    //                               Oldest posts 16
    //                    & Deletes a post when searching by newest posts ===> 16 posts updates to 15
    //                                              if they switched back to sorting by oldest post, it still shows as 16
    // so we call mutate() to say, hey if they change the sorting methods
    // then revalidate all the grabbed pages for that sorting method

    mutate();
  }, [sortingValue, sortingProperty]);

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

  // ###############    FILTERING LOGIC   ###############

  useEffect(() => {
    if (unfilteredPostData && unfilteredPostData.length > 0) {
      let filteredFromFunction = filteringPosts(
        unfilteredPostData,
        toggledTagFilters,
      );

      if (filtersWereToggled) {
        //we only want to change to page 1 if the tags were NEWLY toggled
        // otherwise if we use if (toggledTagFilters), then users that selected a tag would keep getting sent to page 1
        setCurrentlyClickedPage(1);
        setFiltersWereToggled(false);
      }

      setFilteredPosts(filteredFromFunction);
    }
  }, [toggledTagFilters, unfilteredPostData]);
  // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time toggledTagFilters is changed

  //adding or removing filters that we're looking for
  const handleFilterChange = (e) => {
    setFiltersWereToggled(true);

    const { value, checked } = e.target;
    checked
      ? setToggledTagFilters([...toggledTagFilters, value])
      : setToggledTagFilters(toggledTagFilters.filter((tag) => tag != value));
  };

  return (
    <div className="bg-100devs">
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
        automaticallyLoadingMoreData={automaticallyLoadingMoreData}
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
                setChangedItemsSwrPageFunction={setChangedItemsSwrPageFunction}
                changedItemsSwrPage={changedItemsSwrPage}
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
        processingPageChange={processingPageChange}
        setProcessingPageChangeFunction={setProcessingPageChangeFunction}
        swrCacheNumberOfPages={size}
        totalPostCount={totalPostCount}
      />
    </div>
  );
}
