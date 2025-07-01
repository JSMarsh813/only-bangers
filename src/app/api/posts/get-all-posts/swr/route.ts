import grabbingPostData from "../../../../../utils/grabbingPostData/grabbingPostData";

export async function GET(request: Request) {
  const apiLinkType = "generalPostsAll";
  const response = await grabbingPostData(request, apiLinkType);
  return response;
}
