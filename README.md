<!-- Improved compatibility of back to top link: See: https://github.com/JSMarsh813/only-bangerse/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the only-bangerse. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />

<p> Full disclosure: I added this readme after the hackathon deadling. If that matters at all for the hackathon, please disregard this readme. </p>

![logo](https://github.com/user-attachments/assets/4ff178a4-9671-4ccb-b10b-d4a47e53bfd0)

  <h3 align="center">only-bangers</h3>

  <p align="center">
    "Git" just the resources you need! Use tags to filter through our community-powered database of coding resources, networking and career tips.
    <br />
    <a href="https://onlybangers.netlify.app/">View Demo</a>
    &middot;
    <a href="https://github.com/JSMarsh813/only-bangers/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/JSMarsh813/only-bangers/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
       <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
     <li><a href="#concerns-to-solve"> Solved Problems </a></li>  
    <li><a href="#concerns-to-solve">Concerns To Solve </a></li>  
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![screenshot of website that shows filters to the left and posts to the right](https://github.com/user-attachments/assets/99988867-8316-49c3-a4be-80b0148bfae3)


Problem points this project aims to solve aka the Inspiration behind this project:

* Problem: Your private list of resources or browser folders full of resource urls can easily get unweildly and its hard to find specific resources quickly
    * Solution: Tag system allows you to sort through shared resources by tags

* Problem: You vaguely remember a video somewhere talked about a certain subject, like networking on twitter. But just the idea of clicking on several videos and finding that specific section is exhausting. So you use up all your energy hunting down that resource instead of networking or whatever else you intended to do.
    * Solution: Share video or podcast resources with specific timestamps for specific topics. So you can use tags to find what video and at what time that topic comes up.

* Problem: Community members often share "banger" public resources in the discord however, those links tend to get swallowed up over time unless you get lucky with searching in discord
    * Solution: As long as the resources are tagged correctly, they'll no longer be lost to time

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

* [![Appwrite]][Appwrite-url]
* [![Next.js]][Next-url]
* [![React.js]][React-url]
* [![Tailwindcss]][Tailwindcss-url]
* [![Mui]][Mui-url]
* [![Fontawesome]][FontAwesome-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Add and show posts
- [x] Add filtering system
- [ ] Add auth system
- [ ] Add likes
- [ ] Add dashboard where users can view liked posts and edit posts they submitted
- [ ] Add flag system

See the [open issues](https://github.com/JSMarsh813/only-bangerse/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Solved Problems -->

### Solved Problems

* Cannot query appwrite to get documents based on their tags, because users cannot query based on relationship fields (fields that link from one document to another)
Link to the docs about this: https://appwrite.io/docs/products/databases/relationships#queries
    * Solution: Manually filtered through the nested data structure
    * Use state to keep track of the changing data
  ```
    // store the posts we got from the server in state
      const [posts, setPosts] = useState([...initialPosts]);
   // store the tags the user wants to filter by
     const [tagFilters, setFiltersState] = useState([]);
  // render these filtered posts
    const [filteredPosts, setFilteredPosts] = useState([]);

  //
  ```
    * update the array of filtered tags if the user adds or removes tags

  ```
   //adding or removing filters that we're looking for
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    checked
      ? setFiltersState([...tagFilters, value])
      : setFiltersState(tagFilters.filter((tag) => tag != value));
  };
  ```
  
     * useEffect will run everytime in the dependecy array runs: tagFilters, posts
 
     So it will run if:
     1. our intial posts from the server change or
     2. the user adds or removes tags to filter by

  ```
  useEffect(() => {
    let currenttags = tagFilters;

    setFilteredPosts(
      // filter is iterating over every object
      posts.filter((object) =>
          // we are filtering based on the tags, every tag needs to return yes, I am inside this object/post's tags
          // so currenttags goes first
          currenttags.every((tag) =>
                  // then we need to trim the object down to just tag names
                 //object.tags trim each object so they just have their tags property with an array of tag objects
                object.tags.map((tag) =>
                     // use map to then trim each tag object in the array to just its tag_names property
                     tag.tag_name)
                             //now we can see if the tag from tagFilters is in this tags array
                             // if the array has the tag, filter returns true so the post is not filtered out
                             // otherwise filter returns false, so the post is filtered out
                             .includes(tag),
          ),      
        //
      ),
    );
  }, [tagFilters, posts]);

  ```

* I noticed I was not getting my entire list of tags back. I found out appwrite defaults listdocuments to return 25 documents unless otherwise specified
  
   * edited the query limit to 5000 so we can get all the tags
   * thread which discussed this: https://appwrite.io/threads/1201609088421867680
 ```
  export async function GET(request) {
  //   const sessionCookie = cookies().get("session");

  try {
    //needed documents: response to get the documents back
    // const {response} just resulted in empty data
    const { documents: tagList } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_TAGS,
      [Query.limit(5000)],
    );
    //
    return Response.json({ tagList });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json("error", {
      message: "An error occured!",
    });
  }
}

  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONCERNS -->

### Concerns To Solve

* Avoid private information from being unintentionally shared / Its vital to maintain the cozy private atmosphere of the 100devs tea spills, offices hours and discord
    * Solution (Done): Added a checkbox saying the user agrees the content meets community guidelines (only sharing public content)
    * Solution (Done): Require that each post have a url, to ensure each is publically shared content
    * Solution (Future): Add a flag report form & database so users can notify us about content which does that not meet community guidelines or suggest edits to the posts (ex: suggesting additional tags)

* Avoiding legal trouble
    * (Undecided) Decide if this site will only share (public) 100devs content and (public) content created specifically by 100devs alumni
    * Solution (done): Limit the size of the quote and summary sections so users can't add the whole resource (and to avoid spammers from uploading the bee movie script 😜 )
    * (undecided) if we're sharing resources outside of the 100devs community, how do we handle recommending books? Would small snippets legally be okay or should we only allow summaries? 

* Do we want to limit this to public 100devs content or are we going to list any public coding resource? 

*  How to balance honoring content creators choice if they delete their content & avoid deleting data just because there was an server outage or url change
Concerns:
    * if the url just needs to be updated, then it would be unfortunate to delete a useful resource, especially is users had it on their list of liked posts. We want users to trust that the resources they saved for later won't suddenly disappear just because the url is temporarily down or there was an adjustment to the urls name
    * however we want to respect the content creators wishes if they do want the resource essentially deleted from the internet
    * If we filter out these posts on the main page, could this be done fast enough to not have the content flash before its hidden?
    * (undecided) If someone does request their content be removed, how do we handle that? Will this be a rare enough case that we should be able to handle it manually? How would we prevent new mentions of this resource from popping up? Blocking the url? aka what information do we need to honor this request?
Potential Solutions:
    * Allow users who liked it to still view it
    *  Don't show it on the post feed (somehow check the urls status and if its something other than 200, then hide it)
    *  If the url gives a faulty status request, maybe automatically submit a report? Maybe to an errors collection? That way the content could be updated if the urls been changed

* Avoiding duplicate content
Multiple posts can be about different sections of the same peice of content, like a video. Which is exactly what we want. However, someone can reshare that specific clip/section of the content unintentionally

* Potential Solution 1: Add a database which links urls to specific posts. So when a user creates a post, it will look up if that url exists and then add the posts id to it, to link the two databases.
    * Con: This would require extra database requests
    * Con: More complexity
    * Con: how to normalize the url since some 
    * Possible Solution: Run a function to delete everything after a "?" to get the raw url without any queries? 
    * Con: Sites give different versions of a url
    * Possible Solution: for sites that this is a known issue, run a function to check if its the version of the url we want (aka a youtube link with share added so it can be embedded)
    * Overall: this is possible, but is all that added complexity worth it just to avoid duplicated data?

* Potential Solution 2: in the flag report, add a way for users to notify us about potentially duplicated content
    * con: would have to manually check
    * pro: avoids the extra code complexity

* Potential Solution 3: when adding new content, allow users to query for created posts that have a specific url (and the resources starting time if its a video/podcast)
    * con: most users aren't going to want to manually check 
    * pro: but would be appreciated by some users
    * con: extra coding logic/complexity, especially if we incorporate the time. How many seconds do we decide is close enough to the given starting time, for a post to qualify as a potential duplicate?


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Twitter/X - [@Janethedev](https://x.com/Janetthedev) Link: https://x.com/Janetthedev
</br>
Bluesky - [@ghiblimagic](https://bsky.app/profile/ghiblimagic.bsky.social) Link: https://bsky.app/profile/ghiblimagic.bsky.social
</br>
Project Link: [https://github.com/JSMarsh813/only-bangers](https://github.com/JSMarsh813/only-bangers)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Github Project Template](https://github.com/othneildrew/Best-README-Template/blob/main/README.md)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/JSMarsh813/only-bangers
[contributors-url]: https://github.com/JSMarsh813/only-bangers/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/JSMarsh813/only-bangers
[forks-url]: https://github.com/JSMarsh813/only-bangerse/network/members
[stars-shield]: https://img.shields.io/github/stars/JSMarsh813/only-bangers
[stars-url]: https://github.com/JSMarsh813/only-bangerse/stargazers
[issues-shield]: https://img.shields.io/github/issues/JSMarsh813/only-bangers
[issues-url]: https://github.com/JSMarsh813/only-bangerse/issues
[license-shield]: https://img.shields.io/github/license/JSMarsh813/only-bangers
[license-url]: https://github.com/JSMarsh813/only-bangerse/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=blue
[linkedin-url]: https://linkedin.com/in/JSMarsh813
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Appwrite]: https://img.shields.io/badge/Appwrite-20232A?style=for-the-badge&logo=Appwrite&logoColor=61DAFB
[Appwrite-url]: https://appwrite.io/
[Tailwindcss]: https://img.shields.io/badge/Tailwindcss-20232A?style=for-the-badge&logo=Tailwindcss&logoColor=61DAFB
[Tailwindcss-url]: https://tailwindcss.com/
[Mui]: https://img.shields.io/badge/mui-20232A?style=for-the-badge&logo=mui&logoColor=61DAFB
[Mui-url]: https://mui.com/material-ui/
[Fontawesome]: https://img.shields.io/badge/Fontawesome-20232A?style=for-the-badge&logo=Fontawesome&logoColor=61DAFB
[Fontawesome-url]: https://fontawesome.com/
