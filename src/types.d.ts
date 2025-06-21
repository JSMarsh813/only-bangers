//for types that are used throughout the project

type TagType = {
  $collectionId?: string;
  $createdAt?: string;
  $databaseId?: string;
  $id: string;
  $permissions?: Array<string>;
  $sequence?: string;
  $updatedAt?: string;
  tag_name: string;
};
// $collectionId:"67c80eb80036981441a2"
// $createdAt:"2025-03-05T08:49:52.870+00:00"
// $databaseId:"67c80e49000a8d4301f9"
// $id:"67c810320013a4dcb1d4"
// $permissions:[]
// $sequence:"1"
// $updatedAt:"2025-05-16T08:14:23.622+00:00"
// tag_name:"service or retail"

type CategoriesAndTagsType = {
  $collectionId?: string;
  $createdAt?: string;
  $databaseId?: string;
  $id: string;
  $permissions?: Array<string>;
  $sequence?: string;
  $updatedAt?: string;
  category_name: string;
};

// $collectionId : "67c80e81003245661e06"
// $createdAt:"2025-03-05T08:46:58.964+00:00"
// $databaseId:"67c80e49000a8d4301f9"
// $id:"67c80f840018b174e6e4"
// $permissions:[]
// $sequence:"1"
// $updatedAt:"2025-03-05T09:10:56.445+00:00"
// category_name: "managing_blockers"

type FormStateType = {
  check_sharing_okay: boolean | "error" | "No value found";
  resource_url: string | "error" | "No value found";
  start_time_hours?: number;
  start_time_minutes?: number;
  start_time_seconds?: number;
  summary: string | "error" | "No value found";
  quote?: string | "error" | "No value found";
  shared_by_user: string | "error" | "No value found";
  has_a_play_button: "yes" | "no" | "error" | "No value found";
  tags: string[] | "No value found";
  isUrlEmbedded: boolean | "error" | "No value found";
};

type PostResponseType = {
  data: FormStateType;
  message: string;
};

type ArrayOfKeyValuePairsDataType = [
  string,
  string | number | boolean | string[],
][];
//the type is an array of tuples. In this case, an array of [key,value]  pairs.
// the 1st element is a string.
// The second element can be a string, number,boolean, string[] (array of strings)
//
// so it can look something like this:
// [
//   ["name", "Alice"],
//   ["age", 30],
//   ["isStudent", true],
//   ["hobbies", ["reading", "coding"]]
// ]
