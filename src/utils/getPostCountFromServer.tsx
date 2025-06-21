import axios from "axios";
import conf from "@/config/envConfig";

export default async function getPostCountFromServer() {
  try {
    const postCountData = await axios.get(
      `${conf.baseFetchUrl}/api/posts/get-posts-count`,
    );
    //it gets sent as a response object, so we're grabbing the data from it that we need
    const { postCount } = await postCountData.data;
    const currentCount: number = Number(postCount.count);
    return currentCount;
  } catch (error) {
    console.error("Error fetching data get-posts-count on root page:", error);
    return [];
  }
}
