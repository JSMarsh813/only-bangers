export default function getPageNumberFromUrl(url) {
  try {
    const queryStringArray = url.split("?");

    //ex: [
    // "/api/posts/swr",
    // "page=0&lastId=null&sortingValue=-1&sortingProperty=_id"
    //]
    const queryStringExtracted = queryStringArray[1];
    const params = new URLSearchParams(queryStringExtracted);
    // for (const [key, value] of params.entries()) {
    //     console.log(`${key}: ${value}`);
    //   }
    //"page: 0"
    // "lastId: null"
    // "sortingValue: -1"
    // "sortingProperty: _id"

    const page = params.get("page");
    // returns string ex: "0"

    // Handle null, undefined, or non-numeric values gracefully
    const pageNumber = parseInt(page);
    // returns NaN if it can't be converted
    return isNaN(pageNumber) ? null : pageNumber;
  } catch (err) {
    console.error("Invalid URL:", err);
    return null;
  }
}
