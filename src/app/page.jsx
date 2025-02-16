import PostList from "./components/PostList";
import { getPosts } from "./actions/postActions";
import { getTags } from "./actions/tagActions";

// import '../styles/globals.css'
import SectionForNewFormButtonAndForm from "./components/SectionForNewFormButtonAndForm";

export default async function Home() {
  const posts = await getPosts();
  const tags = await getTags();

  return (
    <div className="">
      <main className="text-center">
     
        <SectionForNewFormButtonAndForm tags={tags} />
        <PostList initialPosts={posts} />
      </main>
      <footer className="">
        <span> Footer</span>
      </footer>
    </div>
  );
}
