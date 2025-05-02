let removeDeletedContent = function (
  setListOfContent,
  listOfContent,
  deleteThisContentId,
  setDeleteThisContentId,
) {
  setListOfContent(
    listOfContent.filter(
      (ContentFromList) => ContentFromList.$id != deleteThisContentId,
    ),
  ) && setDeleteThisContentId(null);
};

export default removeDeletedContent;
