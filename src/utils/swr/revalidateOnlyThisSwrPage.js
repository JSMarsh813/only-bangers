import getPageNumberFromUrl from "./getPageNumberFromUrl";

// Handling edits
export default function revalidateOnlyThisSwrPage(
  cachePageUrl,
  targetCachePage,
) {
  const cachePageNumberFromUrl = getPageNumberFromUrl(cachePageUrl);
  console.log(`edit this is cachePageNumberFromUrl ${cachePageNumberFromUrl}`);
  console.log(`edit this is  targetCachePage ${targetCachePage}`);
  console.log(
    `edit cachePageNumberFromUrl === targetCachePage${
      cachePageNumberFromUrl === targetCachePage
    }`,
  );
  return cachePageNumberFromUrl === targetCachePage;
}

// Handling deletions
export function revalidateMultipleSwrPage(cachePageUrl, targetCachePage) {
  const cachePageNumberFromUrl = getPageNumberFromUrl(cachePageUrl);
  return cachePageNumberFromUrl >= targetCachePage;
}
