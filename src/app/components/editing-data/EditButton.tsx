import React, { useState } from "react";
import GeneralButton from "../GeneralButton";
import EditPostForm from "../form/EditPostForm";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

type EditButtonTypes = {
  post: PostType;
  tagList: TagType[];

  setMessageFromApi: React.Dispatch<React.SetStateAction<string[]>>;

  setNameEditedFunction: React.Dispatch<React.SetStateAction<boolean>>;

  postsSwrPageProperty: number | null | undefined;

  setChangedItemsSwrPage: React.Dispatch<
    React.SetStateAction<number | null | undefined>
  >;

  categoriesAndTags: CategoriesWithTagsType[];
};
export default function EditButton({
  post,
  tagList,
  setMessageFromApi,
  setNameEditedFunction,
  postsSwrPageProperty,
  setChangedItemsSwrPage,

  categoriesAndTags,
}: EditButtonTypes) {
  const [editFormVisible, setEditFormVisible] = useState(false);
  return (
    <>
      <GeneralButton
        text="Edit"
        className=" bg-blue-950"
        type="submit"
        fontAwesome={faPencil}
        onClick={() => setEditFormVisible(!editFormVisible)}
      />
      {editFormVisible && (
        <EditPostForm
          post={post}
          tagList={tagList}
          setEditFormVisible={setEditFormVisible}
          editFormVisible={editFormVisible}
          setMessageFromApi={setMessageFromApi}
          setNameEditedFunction={setNameEditedFunction}
          postsSwrPageProperty={postsSwrPageProperty}
          setChangedItemsSwrPage={setChangedItemsSwrPage}
          categoriesAndTags={categoriesAndTags}
        />
      )}
    </>
  );
}
