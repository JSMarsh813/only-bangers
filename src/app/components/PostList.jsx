"use client";
import { useState} from "react";
import Image from 'next/image'
import { deletePost } from "../actions/postActions";
import ParagraphRenderBasedOnArrayProperty from "./ParagraphRenderBasedOnArrayProperty";
import GeneralButton from "./GeneralButton";
import ShowTime from "./ShowTime";

//<Post[]>'s type is written out in src/types.d.ts
export default function PostList({ initialPosts }) {
  //initialPosts is a list of post objects
  const [posts, setPosts] = useState([initialPosts]);

  //setPosts grabs the initialPosts prop and says hey, this is list of posts is my starting state

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    checked
      ? setPosts([...posts, value])
      : setPosts(posts.filter((post) => post != value));

    setPage(1);
  };

  const handleDelete = async (postId) => {
    const element = document.getElementById(postId);

    if (element) {
      element.classList.add("crossed-out");
    }

    await deletePost(postId);
  };
  return (
    <ul>
    
      {initialPosts.map((post) => (
        <li
          key={post.$id}
          id={post.$id}
        
        >
            <div className="w-full">
            <iframe
              src={post.link}
              loading="eager"
              className="mx-auto aspect-video w-5/6 md:w-4/6"
            ></iframe>
          </div>
          {post.category_type === "video-or-podcast" && (
            <div>
              <span className="block">
                {`Start: ${post.start_time_hours} hours ${post.start_time_minutes} minutes ${post.start_time_seconds} seconds`}{" "}
              </span>
              <span className="block">
                {`End: ${post.end_time_hours} hours ${post.end_time_minutes} minutes ${post.end_time_seconds} seconds`}{" "}
              </span>
            </div>
          )}
          {post.summary && (<p> Summary: {post.summary}  </p>)}
        
          {post.quote && ( 
          <blockquote> Quote: {post.quote}  </blockquote>
        )}
          <span className="whitespace-pre-wrap break-all"> Link: {post.link}</span>

         
   
        
          {/* <p>Shared by: {post.shared_by_user}</p> */}
          {post.shared_by_user && (

          <section className="flex justify-center">

<Image
          
            src={post.shared_by_user.profile_image}
            layout=""
            className="rounded-2xl inline mr-2"
            width={80}
            height={80}
          />
         <div>
          <span className="font-bold">Shared by: {post.shared_by_user.user_name} </span>
           <ShowTime  postDate={post.$createdAt}/>
          </div>

        
       
      
           
          </section>
          )}
          <ParagraphRenderBasedOnArrayProperty content={post.tags} text="tags"/>
          <GeneralButton text="Delete"
        className="mx-auto"
        type="submit"
        onClick={() => handleDelete(post.$id)
        }/>
        </li>
      ))}
    </ul>
  );
}
