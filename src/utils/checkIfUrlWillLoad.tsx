"use server";

// check if the reponse headers say the resource is allowed to be embedded in an iframe
export default async function checkUrl(url: URL | string) {
  try {
    // console.log(`this is url in fetch  ${url}`);
    const response = await fetch(`${url}`, {
      method: "GET",
    });

    // The Headers object isn't a great candidate for console.log() since it is not easily serialisable.
    //If you want to see everything in it, try breaking it down to its entries via spread syntax
    //https://stackoverflow.com/questions/67831649/how-to-get-content-type-from-the-response-headers-with-fetch
    // console.log(...response.headers);

    const noEmbeddingAllowedHeader =
      response.headers.get("x-frame-options") === "SAMEORIGIN";

    const resouceCanBeEmbedded = noEmbeddingAllowedHeader ? false : true;
    return resouceCanBeEmbedded;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }

    return "an error occured when checking this url";
  }
}
