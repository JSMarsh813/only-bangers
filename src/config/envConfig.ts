const conf = {
  baseFetchUrl: String(process.env.NEXT_PUBLIC_BASE_FETCH_URL),

  appwriteUrl: String(process.env.ENDPOINT),

  appwriteApiKey: String(process.env.API_KEY),

  projectId: String(process.env.PROJECT_ID),

  databaseId: String(process.env.DATABASE_ID),

  reportsCollectionId: String(process.env.COLLECTION_REPORTS),

  categoriesCollectionId: String(process.env.COLLECTION_CATEGORIES),

  tagsCollectionId: String(process.env.COLLECTION_TAGS),

  postsCollectionId: String(process.env.COLLECTION_POSTS),

  usersCollectionId: String(process.env.COLLECTION_USERS),

  collectionsCount: String(process.env.COLLECTIONS_COUNT),

  generalPostsCollectionCount: String(
    process.env.GENERAL_POSTS_COLLECTION_COUNT,
  ),
};

export default conf;

//https://medium.com/@himanshu.sharma.for.work/integrating-appwrite-with-react-66bc419d1461
//wraps these environment variables in a string format to ensure that all the variables are accessed as strings
