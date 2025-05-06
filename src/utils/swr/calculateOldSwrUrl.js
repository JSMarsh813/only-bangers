export function calculateOldSwrCursor(
  recalcuateOldSwrPage,
  itemsPerPageInServer,
  unfilteredPostData,
) {
  // ########### Now to recalculate the old cursor pointer id  ######################
  let recalculateOldSwrCursorIdIndex = null;
  //page 0's cursor id is null

  if (recalcuateOldSwrPage !== 0) {
    // if page 1, we want item 120's id
    let whatItemWeWant = recalcuateOldSwrPage * itemsPerPageInServer;
    // page 1 * 120 == item 120
    // page 2 * 120 === item 240
    let indexOfCursorIdItem = whatItemWeWant - 1;
    // which would be at the 119 index, since its an array aka starts at 0
    let grabCursorItemsId = unfilteredPostData[indexOfCursorIdItem].$id;

    recalculateOldSwrCursorIdIndex = grabCursorItemsId;
  }

  return recalculateOldSwrCursorIdIndex;
}

export function calculateOldSwrPage(
  currentlyClickedPage,
  itemsPerPage,
  itemsPerPageInServer,
) {
  let howManyItemsWereLoadedAtThisPoint = currentlyClickedPage * itemsPerPage;

  //1 * 5 = 5 items
  //2* 5 = 10 items
  let floatValueOfOldSwrPage =
    howManyItemsWereLoadedAtThisPoint / itemsPerPageInServer;
  //5/120 == 0.041 ===> page 0
  // 120/120 ==> 1 but we actually want page 0
  // 121/120 ==> page 1

  if (floatValueOfOldSwrPage === 0) {
    //handling an edge case
    //if its 0/0 that means no data was loaded, so there was a strange error or no data was loaded
    return null;
  }

  let recalcuateOldSwrPage = Number.isInteger(floatValueOfOldSwrPage)
    ? floatValueOfOldSwrPage - 1
    : Math.floor(floatValueOfOldSwrPage);
  // Swr pages: 0,1,2,3,4,5
  // floatValueOfOldSwrPage-1
  //120/120 ==> 1 needs to be -= 1, so its the right page: 0
  // math floor because the swrCache starts at 0
  //5/120 == 0.041 ===> page 0
  // 121/120 ==> page 1

  return recalcuateOldSwrPage;
}

export default function calculateOldSwrPageAndCursor(
  currentlyClickedPage,
  itemsPerPage,
  itemsPerPageInServer,
  unfilteredPostData,
) {
  const recalcuateOldSwrPage = calculateOldSwrPage(
    currentlyClickedPage,
    itemsPerPage,
    itemsPerPageInServer,
  );

  const recalculateOldSwrCursorIdIndex = calculateOldSwrCursor(
    recalcuateOldSwrPage,
    itemsPerPageInServer,
    unfilteredPostData,
  );

  //currentPageVisible * items per page / 120 items from server //round up
  return [recalcuateOldSwrPage, recalculateOldSwrCursorIdIndex];
}
