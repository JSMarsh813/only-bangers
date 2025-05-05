export default function filteringPosts(unfilteredPostData, toggledTagFilters) {
  if (unfilteredPostData && unfilteredPostData.length > 0) {
    let filteredRawData = unfilteredPostData.filter((object) =>
      //we're iterating through every post object we've gotten back from the server

      toggledTagFilters.every((tag) =>
        // then for every post, we're iterating through every filter the user has toggled on
        // we are filtering based on the tags, every toggled tag needs to return yes, I exist inside this object/post's tags

        object.tags
          .map(
            (tag) =>
              //we need to trim the object down to just tag names, so we use object.tags to get an array of tag  objects

              // ex: [{"tag_name":"networking","$id":"67c8105f002a68d2e2ab","$createdAt":"2025-03-05T08:50:38.227+00:00","$updatedAt":"2025-03-05T09:02:52.882+00:00"}]

              // then we use map to iterate through this array of tag objects
              tag.tag_name,
            //we then trim the tag object to just the tag_name property, so we can compare it to the toggled tag filter
          )
          .includes(tag),
      ),
    );
    return filteredRawData;
  }
}
