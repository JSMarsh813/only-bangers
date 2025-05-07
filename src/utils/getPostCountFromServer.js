import axios from "axios";
import conf from "@/config/envConfig";

export default async function getPostCountFromServer() {
  try {
    let postCountData = await axios.get(
      `${conf.baseFetchUrl}/api/posts/get-posts-count`,
    );
    //it gets send at a response object, so we're grabbing thh data from it that we need
    let { postCount } = await postCountData.data;
    return postCount.count;
  } catch (error) {
    console.error("Error fetching data get-posts-count on root page:", error);
    return [];
  }
}
