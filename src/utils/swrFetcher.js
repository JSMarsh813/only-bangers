export default async function fetcher(...args) {
  console.log("Fetching URL:", args[0]);
  //Fetching URL: /api/posts/swr?page=2&lastId=null
  const res = await fetch(...args);
  console.log("Response:", res);
  return res.json();
}
