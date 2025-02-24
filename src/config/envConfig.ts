const conf = {
  appwriteUrl: String(process.env.NEXT_PUBLIC_ENDPOINT),

  appwriteProjectId: String(process.env.NEXT_PUBLIC_API_KEY),

  projectId: String(process.env.NEXT_PUBLIC_PROJECT_ID),

  databaseId: String(process.env.NEXT_PUBLIC_DATABASE_ID),

  reportsCollectionId: String(process.env.NEXT_PUBLIC_COLLECTION_REPORTS),

  categoriesCollectionId: String(process.env.NEXT_PUBLIC_COLLECTION_CATEGORIES),

  tagsCollectionId: String(process.env.NEXT_PUBLIC_COLLECTION_TAGS),

  postsCollectionId: String(process.env.NEXT_PUBLIC_COLLECTION_POSTS),

  usersCollectionId: String(process.env.NEXT_PUBLIC_COLLECTION_USERS),
};

export default conf;

//https://medium.com/@himanshu.sharma.for.work/integrating-appwrite-with-react-66bc419d1461
//wraps these environment variables in a string format to ensure that all the variables are accessed as strings
