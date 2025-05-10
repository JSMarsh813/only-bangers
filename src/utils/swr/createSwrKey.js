export default function createSwrKey(
  apiPath,
  pageIndex,
  lastIdOfCurrentData,
  sortingValue,
  sortingProperty,
  currentUsersId,
) {
  console.log(
    `this is swrKey in createSwrKey ${`/api/${apiPath}/swr?page=${pageIndex}&lastId=${lastIdOfCurrentData}&sortingValue=${sortingValue}&sortingProperty=${sortingProperty}$currentUsersId=${currentUsersId}`}`,
  );
  return `/api/${apiPath}/swr?page=${pageIndex}&lastId=${lastIdOfCurrentData}&sortingValue=${sortingValue}&sortingProperty=${sortingProperty}&currentUsersId=${currentUsersId}`;
}
