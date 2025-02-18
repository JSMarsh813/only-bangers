import PostList from "./components/PostList";
import axios from "axios";

// import '../styles/globals.css'
import SectionForNewFormButtonAndForm from "./components/SectionForNewFormButtonAndForm";
// //
export default async function Home() {
  // const tags = await getTags();
  const postsData = await axios.get("http://localhost:3000/api/posts");
  const { posts } = postsData.data;

  const categoriesAndTagsData = await axios.get(
    "http://localhost:3000/api/categories",
  );
  const { categoriesAndTags } = categoriesAndTagsData.data;

  const tagsDataForNewPostForm = await axios.get(
    "http://localhost:3000/api/tags",
  );
  const { tagList } = tagsDataForNewPostForm.data;
  return (
    <div className="">
      <header className=" text-white text-3xl p-4 bg-100devs">
        <span>Only Bangers </span>
      </header>
      <main className="text-center">
        <SectionForNewFormButtonAndForm tags={tagList} />
        <PostList
          initialPosts={posts}
          categoriesAndTags={categoriesAndTags}
        />
      </main>
      <footer className="">
        <span> Footer</span>
      </footer>
    </div>
  );
}
