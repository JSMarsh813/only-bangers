import grabbingPostData from "../../../../../lib/gettingPostData/getPosts";

export async function GET(request) {
  let apiLinkType = "generalPostsAll";
  let response = await grabbingPostData(request, apiLinkType);
  return response;
}
