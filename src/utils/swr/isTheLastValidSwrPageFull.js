export default function isTheLastValidSwrPageFull(
  lastSwrPage,
  secondToLastSwrPage,
  itemsPerPageInServer,
) {
  let lastSwrPageLength = lastSwrPage?.length
    ? lastSwrPage.length
    : secondToLastSwrPage.length;

  let isLastSwrPageFull = lastSwrPageLength === itemsPerPageInServer;
  return isLastSwrPageFull;
}
