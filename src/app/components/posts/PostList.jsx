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

  const [unfilteredPostData, setUnfilteredPostData] = useState([]);
  const [tagFilters, setFiltersState] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterIsOpen, SetFilterIsOpen] = useState(true);
  const [lastId, setLastId] = useState(null);

  const PAGE_SIZE = itemsPerPage;

  // ########### SWR Section #################

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
    // if (previousPageData && !previousPageData.length) return null; // reached the end
    console.log(`get key ran `);

    return `/api/posts/swr?pageNumber=${
      pageIndex + 1
    }&notFirstPage==${false}&lastId=${lastId}`;
    // SWR key, grab data from the next page (pageIndex+1) in each loop
  };

  //
  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite(
      (...args) => getKey(...args, PAGE_SIZE, sortingvalue, sortingproperty),
      fetcher,
    );
  // if (!data) return "loading";
  console.log("no data");

  const posts = data ? [].concat(...data) : [];

  let isAtEnd = data && data[data.length - 1]?.length < 1;

  useEffect(() => {
    if (posts) {
      setFilteredPosts([...posts]);
    }
  }, [data]);
  //data was necessary to make it work with swr

  //#################### END of SWR section ##############

  useEffect(() => {
    setPage(1);
  }, [itemsPerPage, sortingvalue, sortingproperty]);

  // const useGetFetchedQueryData = (name) => {
  //   return queryClient.getQueriesData(name);
  // };

  // const grabLastIdFromList = function (data) {
  //   console.log(`this is data in grabLastIdFromList ${JSON.stringify(data)}`);
  //   let dataLength = data.length;
  //   console.log(
  //     `this is data length in grabLastIdFromList ${JSON.stringify(
  //       data.length,
  //     )}`,
  //   );

  //   if (dataLength === 0) {
  //     return null;
  //   }
  //   let justIds = data
  //     .flatMap((item) => item[1]) // Extract the second element of each sub-array
  //     .filter((post) => post && post.$id) // Filter out null or undefined entries
  //     .map((post) => post.$id) // Map to the $id field
  //     .pop(); //grab the last element
  //   setLastId(justIds);
  //   return justIds;
  //   // return justIds[dataLength - 1]; // Return the Last $id from the filtered array
  // };

  //takes too much time to put as UseState default state, will lead to a hydration error
  //so useEffect is needed to update the default initial value, to the unfilteredPosts from the server
  useEffect(() => {
    // let dataFromServer = useGetFetchedQueryData(["posts"]);
    // setUnfilteredPostData(dataFromServer);
    // let lastId = grabLastIdFromList(dataFromServer);
    // console.log(`this is last id ${lastId}`);
    // let lastIdFromUnfilteredPosts =
    //   unfilteredPostData[unfilteredPostData.length - 1];
    // console.log(lastIdFromUnfilteredPosts);
    // setLastId(lastIdFromUnfilteredPosts);
  }, []);

  const fetchNextPosts = async function (page) {
    console.log("fetch post run");

    // if (page === 0) {
    //   return;
    // }
    let postsData = await axios.post(`/api/posts/`, {
      pageNumber: page,
      notFirstPage: false,
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

  //   const {
  //     data, // data accumulated across all pages
  //     error,
  //     fetchNextPage,
  //     hasNextPage, // Boolean that indicates if the next page is available
  //     isFetching,
  //     isFetchingNextPage,
  //     status,
  //   } = useInfiniteQuery({
  //     queryKey: ["posts"],
  //     queryFn: () => fetchNextPosts(currentPage),
  //     initialPageParam: 0,
  //     getNextPageParam: (lastPage, allPages, lastPageParam) => {
  //       if (lastPage.length === 0) {
  //         return undefined;
  //       }
  //       return lastPageParam + 1;
  //     },
  //   });

  // let
  //   if (data) {
  //     console.log(data.pages);
  //   }
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

  // useEffect(() => {
  //   let currenttags = tagFilters;

  //   if (data.pages) {
  //     console.log(
  //       `this is unFilteredPostsData${JSON.stringify(unfilteredPostData)}`,
  //     );
  //     // let lastIdFromUnfilteredPosts =
  //     //   unfilteredPostData[unfilteredPostData.length - 1].$id;

  //     // grabLastIdFromList(unfilteredPostData); //update state of lastId with this function
  //     // console.log(`this is data ${JSON.stringify(data)}`);
  //     // console.log(
  //     //   `this is getFetchedQueryData ${JSON.stringify(
  //     //     useGetFetchedQueryData(["posts"]),
  //     //   )}`,
  //     // );
  //     // setUnfilteredPostData(useGetFetchedQueryData(["posts"]));
  //     setUnfilteredPostData(data.pages);

  //     //grab all the data in react query for posts

  //     // const allQueryData = queryClient.getQueryData(["posts"]);
  //     // console.log(`this is allQueryData${JSON.stringify(allQueryData)}`);
  //   }

  //even witht he prefetech on the server page, reactQuery takes a second to grab the data, so we do if(data) so it waits for the data to load
  //   if (data && data.pages) {
  //     setFilteredPosts(
  //       data.pages.filter(
  //         (object) =>
  //           // we are filtering based on the tags, every tag needs to return yes, I am inside this objects tags
  //           // so currenttags goes first
  //           currenttags.every((tag) =>
  //             object.tags.map((tag) => tag.tag_name).includes(tag),
  //           ),
  //         // then we need to trim the object down to just tag names
  //         // filter is iterating over every object
  //         //object.tags trim each object so they just have their tags property
  //         // use map to then trim each tags so it just has the tag_names property
  //         //
  //       ),
  //     );
  //   }
  // }, [tagFilters, data]);
  // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time tagFilters is changed

  return (
    <div className="bg-100devs">
      <span>
        {" "}
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
