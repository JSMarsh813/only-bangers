export function convertYoutubeUrlToEmbedded(parsedUrl) {
  const videoId = parsedUrl.searchParams.get("v"); // Extract the "v" query parameter

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return null;
}

export function convertLinkedInLUrlToEmbedded(parsedUrl) {
  const path = parsedUrl.pathname; // Get the path (e.g., "/video/live/urn:li:ugcPost:7325887581018120192/")
  const embeddedUrl = null;

  // ########### LIVE ##############
  if (path.includes("live")) {
    //LinkedINLive
    let embedPath = path.replace("/video/live/", "/video/embed/live/");

    embeddedUrl = `${parsedUrl.origin}${embedPath}`;
  }
  // ########### OTHER  ##############
  else {
    const pathParts = parsedUrl.pathname.split("-");
    const indexOfActivity = pathParts.indexOf("activity");

    const activityId = pathParts[indexOfActivity + 1];

    embeddedUrl = activityId
      ? `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${activityId}`
      : null;
  }

  if (embeddedUrl === null) {
    console.log("embedded url returned null");
    return;
  } else {
    return embeddedUrl;
  }
}

export default function convertUrlToEmbedded(url) {
  let parsedUrl = new URL(url);
  let convertedLink = null;

  if (url.includes("youtube")) {
    convertedLink = convertYoutubeUrlToEmbedded(parsedUrl);
    if (convertedLink === null) {
      return;
    }
    return convertedLink;
  } else if (url.includes("linkedin")) {
    convertedLink = convertLinkedInLUrlToEmbedded(parsedUrl);
  }
  return convertedLink;
}
