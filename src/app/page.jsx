import PostList from "./components/PostList";
import { getPosts } from "./actions/postActions";
import { getTags } from "./actions/tagActions";
import { getCategoriesAndTags } from "./actions/categoryActions";

// import { getLoggedInUser } from "@/utils/appwrite";

// import '../styles/globals.css'
import SectionForNewFormButtonAndForm from "./components/SectionForNewFormButtonAndForm";

export default async function Home() {
  const posts = await getPosts();
  const tags = await getTags();
  const categoriesAndTags = await getCategoriesAndTags();

  return (
    <div className="">
      <header className=" text-white text-3xl p-4 bg-100devs">
        <span>Only Bangers </span>
      </header>
      <main className="text-center">
        <SectionForNewFormButtonAndForm tags={tags} />
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
