// get rid of databaseId and CollectionId from object returned from appwrite

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
