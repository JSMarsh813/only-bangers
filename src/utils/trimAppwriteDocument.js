// get rid of databaseId and CollectionId from the document object returned from appwrite
// even if a query is used to select fields, these two always are added on
//databaseId is always first, so breaking out of the loop results in them both being excluded

export const trimAppwriteDocument = (databaseDocument) => {
  const trimmedUserObject = {};
  for (const key in databaseDocument) {
    if (key === "$databaseId") {
      break;
    } else {
      trimmedUserObject[key] = databaseDocument[key];
    }
  }
  return trimmedUserObject;
};

export default trimAppwriteDocument;
