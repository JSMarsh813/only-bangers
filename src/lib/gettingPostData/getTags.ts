// import { databases } from "../../../utils/appwrite"
import { ID, Query } from "appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite/config";
import conf from "@/config/envConfig";

//   try {
//     const categoriesAndTagsData = await axios.get(
//       `${conf.baseFetchUrl}/api/categories-with-tags`,
//     );
//     const { categoriesAndTags } = categoriesAndTagsData.data;
//     return categoriesAndTags;
//   } catch (error) {
//     if (error.cause instanceof AggregateError) {
//       console.error(e.cause.errors);
//     } else {
//       console.error(
//         "Error fetching data for categories and tags  in Dashboard:",
//         error,
//       );
//     }
//     return [];
//   }
// }

export default async function getTags() {
  const { account, databases } = await createSessionClient();
  //   console.log("Account:", account);
  //     console.log("Databases:", databases);
  //   const sessionCookie = cookies().get("session");

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: tagList } = await databases.listDocuments(
      conf.databaseId,
      conf.tagsCollectionId,
      [Query.limit(5000)],
    );
    //https://appwrite.io/threads/1201609088421867680
    //adding query to get all the tags, otherwise its limited to 25

    //rather than convert the data to tagType later with type casting/mapping, the data from the server is already set up with that type in mind. So convert it to that type directly from the server:
    return tagList as TagType[];
  } catch (error) {
    console.error("An error occurred while fetching tagList", error);
    return [];
  }
}
