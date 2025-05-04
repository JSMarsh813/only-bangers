import React, { useEffect, useState, useRef } from "react";
import GeneralButton from "./GeneralButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "./LoadingSpinner";

export default function Pagination({
  currentlyClickedPage,
  itemsPerPage,
  isAtEnd,
  setItemsPerPageFunction,
  setCurrentlyClickedPageFunction,
  //setCurrentlyClickedPageFunction is the page number the user sees, it doesn't affect the swr page number
  setSizeFunction,
  size,
  filteredContentLength,
  setSortingLogicFunction,
  unfilteredPostDataLength,
  processingPageChange,
  setProcessingPageChangeFunction,
  currentPostCount,
}) {
  const numberOfPages = Math.ceil(filteredContentLength / itemsPerPage);

  let arrayOfPageNumbers = [];
  for (let i = 1; i <= numberOfPages; i++) {
    arrayOfPageNumbers.push(i);
  }

  let lastPageNumber = arrayOfPageNumbers.slice(-1).toString();

  const nextPageHandler = () => {
    setProcessingPageChangeFunction(true);

    if (isAtEnd && currentlyClickedPage === lastPageNumber) {
      // console.log("currentlyClickedPage is equal to last page");
      setProcessingPageChangeFunction(false);
      return;
    }

    if (isAtEnd && currentlyClickedPage < lastPageNumber) {
      setCurrentlyClickedPageFunction(currentlyClickedPage + 1);
      setProcessingPageChangeFunction(false);
    } else {
      setSizeFunction(size + 1);
      //this increase the swr "page" size (so page 1 of swr == 120 items currently)
      setCurrentlyClickedPageFunction(currentlyClickedPage + 1);
      //this increased the page the user sees
    }

    // setProcessingPageChange is set false in the parent's component, postList's, useEffect, that's triggered when the data changes
    // its updated there because what takes the most time is the data being updated, filtered, and rendered
    // if we add it here, the user will be able to click the "next page button" before they see the new list rendered
  };

  const clickedOnLastNumber = (lastPageNumber) => {
    setCurrentlyClickedPageFunction(lastPageNumber);
    setSizeFunction(size + 1);
  };

  return (
    <section className="pagination-navigation grid grid-rows-1 min-w-0  bg-blue-800 text-blue-900 font-bold pt-2 ">
      {/* sorting logic*/}
      <div className="inline  my-auto pb-3 ">
        {/* wrapping the selects in sections & inline-block keeps the per page and sort by labels from wrapping weirdly at smaller sizes */}

        {/* Per page */}
        <div className="text-white">
          {JSON.stringify(arrayOfPageNumbers)}
          {JSON.stringify(currentlyClickedPage)}
          {JSON.stringify(isAtEnd)}
        </div>

        <section className="inline-block">
          <select
            id="per-page"
            className="bg-violet-200  ml-2"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPageFunction(e.target.value)}
          >
            <option value="5">5</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45 </option>
            <option value="60">60</option>
          </select>
          <label
            className="text-white ml-2"
            htmlFor="per-page"
          >
            Per Page
          </label>
        </section>
        {/* sort by */}
        <section className="inline-block">
          <select
            id="per-page"
            className="bg-violet-200  ml-2 p-2"
            onChange={(e) => setSortingLogicFunction(e.target.value)}
          >
            <option value="createdAt,oldest">Oldest </option>
            <option value="createdAt,newest">Newest</option>
            <option value="likedbylength,biggest">Most Liked</option>
            <option value="likedbylength,smallest">Least Liked</option>
          </select>

          <label
            className="text-white ml-2"
            htmlFor="per-page"
          >
            Sort by
          </label>

          <span className="text-white ml-8">
            Loaded {unfilteredPostDataLength} / {currentPostCount} posts
          </span>
        </section>
      </div>

      {/* PAGINATION ARROWS */}
      <div className="flex justify-center mb-3 border-t-2 b-white pt-3">
        <button
          className="prevpage "
          aria-label="prevpage"
          disabled={currentlyClickedPage == 1}
          type="submit"
          onClick={() =>
            setCurrentlyClickedPageFunction(currentlyClickedPage - 1)
          }
        >
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            className="text-3xl fa-rotate-180"
            color={`${currentlyClickedPage == 1 ? "grey" : "yellow"}`}
          />
        </button>
        {/* PAGINATION PAGE NUMBERS */}

        {/* Eventually they'll be tons of pages, so we can't show every page number
        so what we do instead is render a small section of page numbers
        3 pages back, the current page, and 3 pages forward */}

        {arrayOfPageNumbers.map((pageNumber) => {
          if (
            pageNumber > currentlyClickedPage + 3 ||
            pageNumber < currentlyClickedPage - 3
          ) {
            return;
          }

          return (
            <GeneralButton
              text={pageNumber}
              key={pageNumber}
              className={`py-1 px-4 mx-2 mt-1 ${
                pageNumber == currentlyClickedPage
                  ? "bg-yellow-300 border-yellow-600"
                  : "bg-blue-300  border-indigo-600"
              }`}
              onClick={() =>
                pageNumber == lastPageNumber
                  ? clickedOnLastNumber(pageNumber)
                  : setCurrentlyClickedPageFunction(pageNumber)
              }
            />
          );
        })}
        <button
          aria-label="nextpage"
          className="nextpage aligncenter"
          type="submit"
          disabled={
            processingPageChange || currentlyClickedPage >= lastPageNumber
          }
          onClick={() => nextPageHandler(currentlyClickedPage)}
        >
          {/* Next button will be greyed and disabled if 1. if we're processing the next page request
            2. we're on the last page */}
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            className="text-3xl mt-2 md:mt-0 "
            color={`${
              currentlyClickedPage >= lastPageNumber || processingPageChange
                ? "grey"
                : "yellow"
            } `}
          />
        </button>

        {processingPageChange && (
          <>
            <span className="text-white my-auto mx-4"> Loading </span>{" "}
            <LoadingSpinner />{" "}
          </>
        )}
      </div>
    </section>
  );
}
