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

type sharedByUserType = {
  $collectionId?: string; //"63333330701198dfb"
  $createdAt: string; //"2025-03-05T09:45:22.832+00:00"
  $databaseId?: string; //"6777777774301f9"
  $id?: string; //"66666666034f8b059f1"
  $permissions: string[];
  // ["read("any")", "delete("user:67c81d310034f8b059f1"…]
  $sequence?: string; //"1"
  $updatedAt?: string; //"2025-03-05T09:45:22.832+00:00"
  profile_image: string; //"https://placecats.com/50/50"
  user_name: string; //"ghiblimagic"
};

type PostType = {
  $collectionId?: string;
  //"66666c815ae000a294a88de"
  $createdAt: string;
  //"2025-03-19T23:00:17.510+00:00"
  $databaseId?: string;
  //"67c999999e49000a8d4301f9"
  $id: string;
  //"66666666665c8"
  $permissions: string[];
  //["read("any")", "delete("user:67c81d310034f8b059f1"…]
  $sequence?: string;
  //"16"
  $updatedAt?: string;
  //"2025-05-20T06:01:00.603+00:00"
  check_sharing_okay: boolean | "error" | "No value found";
  flagged_by_users: string[];
  has_a_play_button: "yes" | "no" | "error" | "No value found";
  isUrlEmbedded: boolean | "error" | "No value found";
  liked_by_users: ["67c81d310034f8b059f1"];
  liked_by_users_length: 1;
  quote?: string | "error" | "No value found";
  resource_url: string | "error" | "No value found";
  //"https://www.youtube.com/embed/bZf6_ld9u9A?si=v7QdXp609POL5MLZ"
  shared_by_user: sharedByUserType;
  // {$collectionId: "67c8156d000701198dfb", $createdAt:…}
  start_time_hours?: number;
  start_time_minutes?: number;
  start_time_seconds?: number;
  summary: string | "error" | "No value found";
  swrPage?: 0;
  tags: TagType[] | "No value found";
  //[{…}, {…}, {…}, {…}]
};
