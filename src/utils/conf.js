const conf = {
  appwrite_project_id: String(process.env.appwrite_project_id),
  appwrite_database_id: String(process.env.appwrite_database_id),
  appwrite_collections_reports_id: String(
    process.env.appwrite_collections_reports_id,
  ),
  appwrite_collections_resource_links_id: String(
    process.env.appwrite_collections_resource_links_id,
  ),
  appwrite_collections_categories_id: String(
    process.env.appwrite_collections_categories_id,
  ),
  appwrite_collections_tags_id: String(
    process.env.appwrite_collections_tags_id,
  ),
  appwrite_collections_posts_id: String(
    process.env.appwrite_collections_posts_id,
  ),
};

export default conf;

//https://medium.com/@himanshu.sharma.for.work/integrating-appwrite-with-react-66bc419d1461
//wraps these environment variables in a string format to ensure that all the variables are accessed as strings
