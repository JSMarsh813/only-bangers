export default async function getPostCount() {
  //tags will not change so we are caching it

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
