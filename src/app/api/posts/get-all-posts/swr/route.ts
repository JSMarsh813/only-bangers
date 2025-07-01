import grabbingPostData from "../../../../../lib/gettingPostData/getPosts";
import { NextRequest } from "next/server";

// why NextRequest and not Request? for extra methods

//NextRequest extends the Web Request API with additional methods

//You can think of it as NextRequest is the type you use in the app router "Route handlers"

//https://www.reddit.com/r/nextjs/comments/12i224x/request_vs_nextrequest_vs_nextapirequest_and/

export async function GET(request: NextRequest) {
  const apiLinkType = "generalPostsAll";
  const response = await grabbingPostData(request, apiLinkType);
  return response;
}
