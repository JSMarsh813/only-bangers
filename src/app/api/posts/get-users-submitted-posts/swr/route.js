import grabbingPostData from "../../../../../utils/grabbingPostData/grabbingPostData";

export async function GET(request) {
  let apiLinkType = "generalPostUserSubmitted";
  let response = await grabbingPostData(request, apiLinkType);
  return response;
}
