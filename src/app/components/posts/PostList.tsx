"use client";
import { useState, useEffect } from "react";
import GeneralButton from "../GeneralButton";
import FilteringSidebar from "../filtering/FilteringSidebar";
import IndividualPost from "./IndividualPost";
import { useUser } from "../context-wrappers/UserInfo";
import fetcher from "@/utils/swr/swrFetcher";
import useSWRInfinite from "swr/infinite";
import { SWRInfiniteKeyLoader } from "swr/infinite";
//import { SWRInfiniteKeyLoader } from 'swr/infinite' needed for typing

import Pagination from "../pagination";

import CheckForMoreData from "../CheckForMoreDataButton";

import isTheLastValidSwrPageFull from "../../../utils/swr/isTheLastValidSwrPageFull";

import {
  grabLastSwrPage,
  calculateOldSwrPage,
  calculateOldSwrCursor,
} from "../../../utils/swr/calculateSwrKeyPieces";
import createSwrKey from "../../../utils/swr/createSwrKey";
import filteringPosts from "../../../utils/filtering/filteringPosts";
import revalidateOnlyThisSwrPage from "../../../utils/swr/revalidateOnlyThisSwrPage";
import calculateSwrPageFromIndex from "../../../utils/swr/calculateSwrPageFromIndex";
import getPostCountFromServer from "../../../utils/getPostCountFromServer";

import { revalidateMultipleSwrPage } from "../../../utils/swr/revalidateOnlyThisSwrPage";

type PostListType = {
  swrApiPath: string;
  categoriesAndTags: CategoriesWithTagsType[];
  tagList: TagType[];
  countOfPosts: number;
};

type CheckingNextSwrPageLengthType = {
  swrApiPath: string;
  oldSwrPage: number | null;
  //will be null on the 1st page of data
  oldSwrCursorKeyID: string | null;
  //will be null on the 1st page of data
  sortingValue: string;
  sortingProperty: string;
  currentUsersId: string;
};

async function mostCurrentPostCountFromServerFunc(): Promise<number> {
  try {
    const countFromServer = await getPostCountFromServer();
    console.log("Post count from server:", countFromServer);
    // Use countFromServer as needed
    const countConvertedToNumber = Number(countFromServer);
    const checkCountIsIntegerOrNaN = Number.isNaN(countConvertedToNumber)
      ? NaN
      : countConvertedToNumber;
    return checkCountIsIntegerOrNaN;
  } catch (error) {
    console.error("Error fetching post count:", error);
    return NaN;
    //NaN is still a number type, so this is valid typescript
    //but NaN will allow us to know an error occured
  }
}

async function checkingNextSwrPageLength({
  swrApiPath,
  oldSwrPage,
  oldSwrCursorKeyID,
  sortingValue,
  sortingProperty,
  currentUsersId,
}: CheckingNextSwrPageLengthType) {
  const swrKey = createSwrKey(
    swrApiPath,
    oldSwrPage,
    oldSwrCursorKeyID,
    sortingValue,
    sortingProperty,
    currentUsersId,
  );

  const response = await fetch(swrKey).then((res) => res.json());
  console.log(`checking next swr page length ${response.length}`);

  return response.length;
}

export default function PostList({
  swrApiPath,
  categoriesAndTags,
  tagList,
  countOfPosts,
}: PostListType) {
  //the server can't pass currentUsersId from context, because server components can't access context because it uses client side logic. So the client components can directly grab the userId from the context provider
  // the context provider was setup in the layout.tsx file
  //   <html lang="en">
  //      <UserProvider>
  // value={{ currentUsersInfo, setTriggerRecheck, triggerRecheck }}
  const { currentUsersInfo, setTriggerRecheck, triggerRecheck } = useUser();
  const currentUsersId: string = currentUsersInfo.$id || "guest";
  //if $id is undefined, null, undefined, "", or otherwise falsey, it will default to guest

  //meanwhile this won't work because currentUsersInfo.$id could be undefined, so typescript yells currentUsersInfo ? currentUsersInfo.$id : "guest"
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortingValue, setSortingValue] = useState("oldest");
  const [sortingProperty, setSortingProperty] = useState("_id");

  const [unfilteredPostData, setUnfilteredPostData] = useState<PostType[]>([]);
  const [toggledTagFilters, setToggledTagFilters] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterIsOpen, setFilterIsOpen] = useState(true);

  const [nameEdited, setNameEdited] = useState(false);
  const [deleteThisContentId, setDeleteThisContentId] = useState<string | null>(
    null,
  );
  const [changedItemsSwrPage, setChangedItemsSwrpage] = useState<
    number | null | undefined
  >(null);
  // null: means hey this is still the default value, if we're getting null when we're expecting a number an error happened

  // number: things working as expected, should be a number 0 or higher

  // undefined: required by typescript since the swrPage field isn't required in PostType, so typescript sees it as always potentionally undefined

  const [loadingData, setLoadingData] = useState(false);
  const [checkingForNewestData, setCheckingForNewestData] = useState(false);
  const [greatestClickedSwrPage, setGreatestClickedSwrPage] = useState(1);

  const [currentlyClickedPage, setCurrentlyClickedPage] = useState(1);
  //currentlyClickedPage is only changing the page the user visually sees
  //currentlyClickedPage will not change the swr cache page
  const [filtersWereToggled, setFiltersWereToggled] = useState(false);
  const [sortingValueChanged, setSortingValueChanged] = useState(false);

  const [totalPostCount, setTotalPostCount] = useState(countOfPosts);
  const [lastSwrPageIsFull, setLastSwrPageIsFull] = useState(false);

  // ################################   SWR AND PAGINATION Section ##############################################

  const itemsPerPageInServer = 5;
  const loadedAllData = unfilteredPostData.length / totalPostCount >= 1;
  const filteredListLastPage = filteredPosts.length / itemsPerPage;

  // useEffects hookhad to be placed in the top of the file, before any early returns ex: if (error) {
  // console.error("Theres was an error!:", error);
  // return <div>Error loading posts.</div>;

  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    // A function to get the SWR key of each page,
    // its return value will be accepted by `fetcher`.í
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
    const lastIdOfCurrentData =
      previousPageData?.[previousPageData.length - 1].$id || null;

    //swrInfinite won't work if you take out the pageIndex, because thats how it knows what page of data its on

    const SwrKeyInGetKey = createSwrKey(
      swrApiPath,
      pageIndex,
      lastIdOfCurrentData,
      sortingValue,
      sortingProperty,
      currentUsersId,
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
  const posts: PostType[] | [] = data ? [].concat(...data) : [];
  console.log("posts ran");

  useEffect(() => {
    console.log("look data changed");
    if (!data) {
      //this is how we trigger swr to start on initial page load
      mutate();
    }

    if (data && !isValidating) {
      // when its validating, sometimes the data gets replaced with a string version of the swr key and rendering fails: ex: data: "/","a","p","i","/","o","s","t","s"......
      // so !isValidating forces it to wait until swr has finished validating that key

      //posts declared on line 403
      // const posts = data ? [].concat(...data) : [];
      const postsWithSwrPageForDeletionsEdits = posts.map((item, index) => ({
        ...item,
        swrPage: calculateSwrPageFromIndex(index, itemsPerPageInServer),
      }));

      setUnfilteredPostData([...postsWithSwrPageForDeletionsEdits]);
      //we don't want to use those unfilteredPosts that didn't have swrPage data
      //so creating a shallow clone ensures that react sees a new reference, so react treats it asa fresh update
      // Even if the contents are the same, the reference is different, so React thinks something changed
      // we want to make sure the old unfilteredPosts data isn't used, since the swrPage is important to SWR logic

      //we don't want to do setUnfilteredPostData (postsWithSwrPageForDeletionsEdits)
      //Why? If postsWithSwrPageForDeletionsEdits is a new array, React will detect a new reference and trigger a re-render.
      // BUT if you accidentally reused a reference from earlier state, React might not detect a change, and SKIP re-rendering
    }

    // setLoadingData will only be set to false, after the data list has already been updated
    //so they can't click to the next page before the changes have been rendered
    setLoadingData(false);
  }, [data]);

  // UseEFFECT for Edits //
  useEffect(() => {
    if (nameEdited) {
      mutate(data, {
        revalidate: (pageData, url) => {
          return revalidateOnlyThisSwrPage(url, changedItemsSwrPage);
        },
      });
      //if we don't set nameEdited back to false, then if we edit another post, swr won't update because this useEffect wouldn't be trigger
      setNameEdited(false);
    }
  }, [nameEdited]);

  // UseEFFECT for Deletions //
  useEffect(() => {
    if (deleteThisContentId !== null) {
      console.log("deletion mutation ran");
      mutate(data, {
        revalidate: (pageData, url) => {
          return revalidateMultipleSwrPage(url, changedItemsSwrPage);
        },
      });
      setTotalPostCount(totalPostCount - 1);
    }
  }, [deleteThisContentId]);

  //#################### keeping track of the last Swr page we loaded ########################
  useEffect(() => {
    if (unfilteredPostData.length === 0) {
      return;
    }

    const currentGreatestSwrPage = grabLastSwrPage(unfilteredPostData);

    if (greatestClickedSwrPage < currentGreatestSwrPage) {
      setGreatestClickedSwrPage(currentGreatestSwrPage);
    }
  }, [unfilteredPostData]);

  // ############# Checking automatically for more data ###############################
  useEffect(() => {
    // checks for more posts automatically for filtered users or for users that change the amount of items per page

    if (unfilteredPostData.length === 0) {
      // this will run during this initial render, we don't want it to do anything yet
      //if we let it go, it would cause errors downstream since unfilteredpostdata is empty
      return;
    }

    if (loadingData) {
      //without this check, if the user clicked the > arrow, we'd be loading 2 pages
      // this check tells it, hey if loadingData is true, so we're already grabbing data
      //  so useEffect, ignore this page change, this call wasn't intended for you
      return;
    }

    const lastLoadedSwrPage = grabLastSwrPage(unfilteredPostData);
    if (
      currentlyClickedPage !== 1 &&
      lastLoadedSwrPage <= greatestClickedSwrPage
    ) {
      // ignore this page click, we're just going back a page, don't load data
      return;
    }

    const amountOfItemsThatShouldBeLoaded = currentlyClickedPage * itemsPerPage;

    if (
      currentlyClickedPage === 1 &&
      filteredPosts.length >= amountOfItemsThatShouldBeLoaded
    ) {
      //edge case for the 1st page: we still want this to run if the user is changing the amount of items per page on page 1
      // however, if they are just clicking back onto page 1, we want the useEffect to ignore that page change
      return;
    }

    if (filteredPosts.length < amountOfItemsThatShouldBeLoaded) {
      setLoadingData(true);

      handleCheckBeforeGrabbingMoreFilteredData();
    }

    if (unfilteredPostData.length === countOfPosts) {
      setLoadingData(false);
    }
    if (filteredPosts.length >= amountOfItemsThatShouldBeLoaded) {
      setLoadingData(false);
    }
    //needs to be triggered either when
    // 1. filteredPosts changes,
    // to fill up the client side page 1 with items that match their filters, we might need to grab from more than 1, 2, 3 ect swr/server pages

    //2. currentlyClickedPage
    // after we fill up client side page 1 with filtered data
    //the 4 server SWR pages of data might of had 1 or 2 extra items that fit the filters, that page 1 didn't need
    // so we need to tell it, hey if the user clicks on the 2nd page, make sure page 2 ALSO has enough items from the server to fill up page 2

    //3. itemsPerPage
    //if someone changes from the default 5 items per page to 15 ect, we tell swr hey fetch enough posts to get to 15 posts for the page
  }, [filteredPosts, currentlyClickedPage, itemsPerPage]);

  // ################## Edge Case Solved for sorting  ##################
  useEffect(() => {
    if (sortingValueChanged) {
      mutate(data, {
        revalidate: (pageData, url) => {
          //typescript gave an error: Property 'includes' does not exist on type 'string | false | ArgumentsTuple | Record<any, any>'.
          // Why?
          //SWRInfinite's revalidate option is typed to receive a url that could be a: string, false,   ArgumentsTuple, Record<any, any>
          // but only string has .includes.

          // so we have to emotionally support typeScript and tell it hey, i'm only going to ask you to do this if url is a string
          if (typeof url === "string") {
            return url.includes(sortingValue) && url.includes(sortingProperty);
          }
          return false; // if url is not a string do the default: aka don't revalidate
        },
      });
    }
    setSortingValueChanged(false);
    // Edge case:

    // Cause: When a user loads all posts for:
    //   Newest posts 16 THEN Oldest posts 16
    // & Deletes a post when searching by newest posts ===> 16 posts updates to 15

    // Result: if they switched back to sorting by oldest post, it still shows as 16
    // Solution: so we call mutate() to say, hey if they change the sorting methods

    // then revalidate all the grabbed pages

    //ideally upon changing the sorting method, we'd clear all cached keys except for page 0 of swr
    // but vercel doesn't have a way to easily reset the cache for swrInfinite
  }, [sortingValue, sortingProperty]);

  useEffect(() => {
    //if the user changes the # of items per page, or changes how they want to sort the posts (ex: by oldest instead of newest)
    // we want to reset the page to 1
    setCurrentlyClickedPage(1);
  }, [itemsPerPage, sortingValue, sortingProperty]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(max-width: 900px)");

      const checkScreenSize = () => {
        setFilterIsOpen(!mediaQuery.matches);
      };

      checkScreenSize();

      mediaQuery.addEventListener("change", checkScreenSize);

      // Cleanup event listener on component unmount to avoid memory leaks
      return () => mediaQuery.removeEventListener("change", checkScreenSize);
    }
  }, []);

  useEffect(() => {
    if (unfilteredPostData && unfilteredPostData.length > 0) {
      const filteredFromFunction = filteringPosts(
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

  // ##############################    SWR: CHECKING FOR NEW DATA    ###################################

  const handleCheckBeforeReloadingFirstPage = async () => {
    const firstPageSwrKey = createSwrKey(
      swrApiPath,
      0,
      null,
      sortingValue,
      sortingProperty,
      currentUsersId,
    );

    const response = await fetch(firstPageSwrKey).then((res) => res.json());
    const newestPostFromFetch = response[0].$id;
    const firstPostFromLoadedData = unfilteredPostData[0].$id;

    const isThereNewData = newestPostFromFetch !== firstPostFromLoadedData;
    return isThereNewData;
  };

  if (error) {
    console.error("Theres was an error!:", error);
    return;
  }

  if (data && data.length === 0) {
    console.error("Theres was no data!:", data);
    return;
  }

  const handleCheckBeforeCallingSetsize = async () => {
    const oldSwrPage = calculateOldSwrPage(
      currentlyClickedPage,
      itemsPerPage,
      itemsPerPageInServer,
    );

    const lastIdOfCurrentData =
      unfilteredPostData[unfilteredPostData.length - 1].$id || null;

    //calculates oldSwrPage and lastId with the 2 functions above
    const newSwrPageLength = await checkingNextSwrPageLength({
      swrApiPath,
      oldSwrPage: oldSwrPage === null ? 0 : oldSwrPage + 1,
      oldSwrCursorKeyID: lastIdOfCurrentData,
      sortingValue,
      sortingProperty,
      currentUsersId,
    });
    const responseIsAnInteger = Number.isInteger(newSwrPageLength);

    if (responseIsAnInteger && newSwrPageLength !== 0) {
      setLoadingData(false);
      setSize(size + 1);
      // EDGE CASE:
      //logic below takes in account if someone has filtered the data
      // lets say the user was on the client side page 1 with 5 items per page
      // if after they clicked a tag, only 1 item from theSWRpage was a match
      // then we're automatically try to load the next 4 from SWRpage2
      // but we're technically still on the client side page 1, even though we're on swrPage2
      // otherwise the user will see an empty page 2 and have to click backwards to page 1
      const updatedPageNumber =
        Math.floor(filteredPosts.length / itemsPerPage) + 1;
      setCurrentlyClickedPage(updatedPageNumber);
    } else if (responseIsAnInteger && newSwrPageLength === 0) {
      console.log(
        `There is no more data to load. The new SWR page's length was ${newSwrPageLength}!`,
      );
      setLoadingData(false);
    } else {
      console.log(
        `An unexpected error occured! The new SWR page's length was not an integer value ${responseIsAnInteger}?`,
      );
      setLoadingData(false);
    }
  };

  function allowRecheckForDataAfterDelay() {
    setTimeout(() => {
      //we completed revalidating the page, return state to false so they can check again for new posts
      setCheckingForNewestData(false);
    }, 30000);
  }

  async function setCheckingForNewestDataFunction() {
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

    if (sortingValue === "newest" || sortingValue === "leastLiked") {
      const thereIsNewData = await handleCheckBeforeReloadingFirstPage();

      if (thereIsNewData) {
        mutate(data, {
          revalidate: (pageData, url) => {
            //typescript demands that url is a string, because only string has the includes property of the types on SWRinfinite's revalidate option
            if (typeof url === "string") {
              return url.includes("newest");
            }
            return false; // if url is not a string do the default: aka don't revalidate
          },
        });

        const currentPostCount = await mostCurrentPostCountFromServerFunc();
        setTotalPostCount(currentPostCount);
        setCheckingForNewestData(false);
        allowRecheckForDataAfterDelay();
        return;
      } else {
        console.log("there is no more new data to load right now");
        setCheckingForNewestData(false);
        allowRecheckForDataAfterDelay();
        return;
      }
      //because we use cursor based pagination, we need to tell it to revalidate all pages
    }

    // handling an edge case, if the last Swr Page's length is 0, we want to ignore it since its not a valid page

    const lastSwrPage = data[data.length - 1];
    const secondToLastSwrPage = data[data.length - 2];

    const isLastSwrPageFull = isTheLastValidSwrPageFull(
      lastSwrPage,
      secondToLastSwrPage,
      itemsPerPageInServer,
    );

    setLastSwrPageIsFull(isLastSwrPageFull);

    if (isLastSwrPageFull === false) {
      // theres still room for more items, so just revalidate/recheck the most current page for new posts

      const oldSwrPage = calculateOldSwrPage(
        currentlyClickedPage,
        itemsPerPage,
        itemsPerPageInServer,
      );

      const oldSwrCursorKeyID = calculateOldSwrCursor(
        oldSwrPage,
        itemsPerPageInServer,
        unfilteredPostData,
      );

      const previousSwrKey = createSwrKey(
        swrApiPath,
        oldSwrPage,
        oldSwrCursorKeyID,
        sortingValue,
        sortingProperty,
        currentUsersId,
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

  const handleCheckBeforeGrabbingMoreFilteredData = async () => {
    const mostCurrentPostCountFromServer =
      await mostCurrentPostCountFromServerFunc();
    if (filteredPosts.length < mostCurrentPostCountFromServer) {
      console.log(
        `ran, filteredPosts.length < mostCurrentPost Count From Server ${filteredPosts.length}  ${mostCurrentPostCountFromServer}`,
      );
      handleCheckBeforeCallingSetsize();
    } else {
      setLoadingData(false);
      console.log("no more data available to load");
    }
  };

  //########################################  END OF SWR SECTION ################################################

  function setSortingLogicFunction(optionValue: string) {
    //this type was weird. when e.target.value was hovered over it showed:
    //(property) ChangeEvent<HTMLSelectElement>.target: EventTarget & HTMLSelectElement
    //This means:
    // e.target is of type HTMLSelectElement
    // and value on an <HTMLSelectElement> is always of type string
    // so e.target.value is actually a string

    // onChange={(e) => setSortingLogicFunction(e.target.value)}
    // the target's value has 2 strings,
    // ex: <option value="createdAt,oldest">Oldest </option>

    setSortingProperty(optionValue.split(",")[0]);
    // createdAt
    setSortingValue(optionValue.split(",")[1]);
    // oldest or newest
    setSortingValueChanged(true);
  }

  // ###############  SETTING INITIAL FILTERING SIDEBAR STATE  ###############

  // ###############    FILTERING LOGIC   ###############

  //adding or removing filters that we're looking for
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltersWereToggled(true);

    const { value, checked } = e.target;
    //The EventTarget type, which e.target initially represents, does not inherently include value or checked
    //so it was necessary to use type assertion to tell react what type the e parameter should be

    if (checked) {
      setToggledTagFilters([...toggledTagFilters, value]);
    } else {
      setToggledTagFilters(toggledTagFilters.filter((tag) => tag !== value));
    }
    //eslint doesn't like it when a ternary is just used to call function conditionally, aka when it doesn't get assigned, returned or otherwise "used"
    //so I switched to if else to make the intent clear
  };

  return (
    <div className="bg-100devs">
      <Pagination
        currentlyClickedPage={currentlyClickedPage}
        itemsPerPage={itemsPerPage}
        lastSwrPageIsNotFull={!lastSwrPageIsFull}
        setItemsPerPage={setItemsPerPage}
        setCurrentlyClickedPage={setCurrentlyClickedPage}
        setSizeFunction={setSize}
        size={size}
        filteredContentLength={filteredPosts.length}
        setSortingLogicFunction={setSortingLogicFunction}
        unfilteredPostDataLength={unfilteredPostData.length}
        loadingData={loadingData}
        setLoadingDataFunction={setLoadingData}
        totalPostCount={totalPostCount}
      />
      {sortingValue === "newest" && currentlyClickedPage == 1 && (
        <CheckForMoreData
          currentlyClickedPage={currentlyClickedPage}
          filteredListLastPage={filteredListLastPage}
          setCheckingForNewestDataFunction={setCheckingForNewestDataFunction}
          checkingForNewestData={checkingForNewestData}
        />
      )}
      {sortingValue === "leastLiked" && currentlyClickedPage == 1 && (
        <CheckForMoreData
          currentlyClickedPage={currentlyClickedPage}
          filteredListLastPage={filteredListLastPage}
          setCheckingForNewestDataFunction={setCheckingForNewestDataFunction}
          checkingForNewestData={checkingForNewestData}
        />
      )}
      {sortingValue === "mostLiked" && loadedAllData && (
        <CheckForMoreData
          currentlyClickedPage={currentlyClickedPage}
          filteredListLastPage={filteredListLastPage}
          setCheckingForNewestDataFunction={setCheckingForNewestDataFunction}
          checkingForNewestData={checkingForNewestData}
        />
      )}

      {sortingValue === "oldest" && loadedAllData && (
        <CheckForMoreData
          currentlyClickedPage={currentlyClickedPage}
          filteredListLastPage={filteredListLastPage}
          setCheckingForNewestDataFunction={setCheckingForNewestDataFunction}
          checkingForNewestData={checkingForNewestData}
        />
      )}
      <GeneralButton
        className="rounded-l-none ml-2 bg-yellow-200 text-blue-900  border-yellow-600"
        type="button"
        text={`${filterIsOpen ? "Close Filters" : "Open Filters"}`}
        onClick={() => setFilterIsOpen(!filterIsOpen)}
      />
      <div className="flex bg-blue-950">
        <FilteringSidebar
          categoriesAndTags={categoriesAndTags}
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
            .map((post: PostType) => (
              <IndividualPost
                key={post.$id}
                post={post}
                tagList={tagList}
                setNameEditedFunction={setNameEdited}
                setDeleteThisContentId={setDeleteThisContentId}
                setChangedItemsSwrPage={setChangedItemsSwrpage}
                categoriesAndTags={categoriesAndTags}
              />
            ))}
        </div>
      </div>
      {sortingValue !== "newest" && loadedAllData && (
        <CheckForMoreData
          currentlyClickedPage={currentlyClickedPage}
          filteredListLastPage={filteredListLastPage}
          setCheckingForNewestDataFunction={setCheckingForNewestDataFunction}
          checkingForNewestData={checkingForNewestData}
        />
      )}
      <Pagination
        currentlyClickedPage={currentlyClickedPage}
        itemsPerPage={itemsPerPage}
        lastSwrPageIsNotFull={!lastSwrPageIsFull}
        setItemsPerPage={setItemsPerPage}
        setCurrentlyClickedPage={setCurrentlyClickedPage}
        setSizeFunction={setSize}
        size={size}
        filteredContentLength={filteredPosts.length}
        setSortingLogicFunction={setSortingLogicFunction}
        unfilteredPostDataLength={unfilteredPostData.length}
        loadingData={loadingData}
        setLoadingDataFunction={setLoadingData}
        totalPostCount={totalPostCount}
      />
    </div>
  );
}
