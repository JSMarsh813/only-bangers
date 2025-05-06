export default function calculateSwrPageFromIndex(
  indexValue,
  itemsPerPageInServer,
) {
  //itemsIndex
  //itemsPerSERVERpage
  // 0-4 SWR page 0      5 items
  // 5-9 SWR page 1      5 items
  // 10-14 SWR page 2    5 items

  // Add page number to each item
  const locationIfStartingAtPage0 = Math.floor(
    indexValue / itemsPerPageInServer,
  );
  //  0/5= 0  ==> 0
  //  4/5 = 0.8 ==> 0
  //  5/5 = 1 ===> 1

  return locationIfStartingAtPage0;
}
