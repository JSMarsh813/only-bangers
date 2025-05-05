export default function createSwrKey(
  apiPath,
  pageIndex,
  lastIdOfCurrentData,
  sortingValue,
  sortingProperty,
) {
  console.log(
    `this is swrKey in createSwrKey ${`/api/${apiPath}/swr?page=${pageIndex}&lastId=${lastIdOfCurrentData}&sortingValue=${sortingValue}&sortingProperty=${sortingProperty}`}`,
  );
  return `/api/${apiPath}/swr?page=${pageIndex}&lastId=${lastIdOfCurrentData}&sortingValue=${sortingValue}&sortingProperty=${sortingProperty}`;
}
