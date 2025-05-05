export default function createSwrKey(
  apiPath,
  pageIndex,
  lastIdOfCurrentData,
  sortingValue,
  sortingProperty,
) {
  return `/api/${apiPath}/swr?page=${pageIndex}&lastId=${lastIdOfCurrentData}&sortingValue=${sortingValue}&sortingProperty=${sortingProperty}`;
}
