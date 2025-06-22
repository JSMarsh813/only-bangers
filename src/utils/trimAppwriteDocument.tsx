import type { Models } from "appwrite";

// get rid of databaseId and CollectionId from the document object returned from appwrite

// even if a query is used to select fields, these two always are added on

//databaseId is always first, so breaking out of the loop results in them both being excluded

export const trimAppwriteDocument = (databaseDocument: Models.Document) => {
  const trimmedUserObject: Record<string, unknown> = {};
  //Record allows the string keys to be assigned

  //otherwise we get this typescript error:

  //Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.

  // No index signature with a parameter of type 'string' was found on type '{}'.ts(7053)

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
