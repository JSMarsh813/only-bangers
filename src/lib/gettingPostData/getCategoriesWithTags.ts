// import { databases } from "../../../utils/appwrite"
import { ID, Query } from "appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite/config";
import conf from "@/config/envConfig";

export default async function getCategoriesAndTags() {
  const { account, databases } = await createSessionClient();

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: categoriesAndTags } = await databases.listDocuments(
      conf.databaseId,
      conf.categoriesCollectionId,
    );

    return categoriesAndTags as CategoriesWithTagsType[];
    // const convertFromModelDocumentTypeToArray: string[] = categoriesAndTags.map(
    //   (doc) => doc.content,
    // );
    // return convertFromModelDocumentTypeToArray;
  } catch (error) {
    console.error(
      "An error occurred while fetching categories and tags",
      error,
    );
    return [];
  }
}

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
